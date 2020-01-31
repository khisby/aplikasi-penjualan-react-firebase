import React, { useEffect, useState } from 'react';
import { useFirebase } from '../../../components/FirebaseProvider';
import {Button, List, ListItem, ListSubheader, ListItemIcon, ListItemText, ListItemAvatar, Typography, Grid, Avatar, TextField, Table, TableRow, TableHead, TableBody, TableCell} from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import SaveIcon from '@material-ui/icons/Save'
import { useCollection } from 'react-firebase-hooks/firestore'
import AppPageLoading from '../../../components/AppPageLoading'
import useStyle from './styles'
import { useSnackbar } from 'notistack';
import { currency } from '../../../utils/formatter'
import format from 'date-fns/format'

function Home() {
    const classes = useStyle()
    const { auth, firestore, user} = useFirebase()
    const { enqueueSnackbar } = useSnackbar() 
    const todayDateString = format(new Date(), 'yyyy-MM-dd')
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)
    const transaksiCol = firestore.collection(`toko/${user.uid}/transaksi`) 
    const initialTransaksi = {
        no: '',
        items:{

        },
        total: 0,
        tanggal: todayDateString
    }
    const [transaksi, setTransaksi] = useState(initialTransaksi)
    
    const [snapshotTransaksi, loadingTransaksi] = useCollection(transaksiCol.where('tanggal', '==', todayDateString))
    const [snapshotProduk, loadingProduk] = useCollection(produkCol)
    const [produkItems, setProdukItems] = useState([])
    const [filterProduk, setFilterProduk] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)

    useEffect(()=>{
        if(snapshotTransaksi){
            setTransaksi(transaksi=>({
                ...transaksi,
                 no: `${transaksi.tanggal}/${snapshotTransaksi.docs.length+1}`
            }))
        }else{
            setTransaksi(transaksi=>({
                ...transaksi,
                 no: `${transaksi.tanggal}/1`
            }))
        }
    },[snapshotTransaksi])
    useEffect(()=>{
        if(snapshotProduk){
            setProdukItems(snapshotProduk.docs.filter((produkDoc)=>{
                if(filterProduk){
                    return produkDoc.data().nama.toLowerCase().includes(filterProduk.toLowerCase())
                }
                return true
            }))
        }
    },[snapshotProduk, filterProduk])

    const addItem = produkDoc  => e =>{
        let newItem = {...transaksi.items[produkDoc.id]}
        const produkData = produkDoc.data()
        if(newItem.jumlah){
            newItem.jumlah = newItem.jumlah + 1
            newItem.subtotal = produkData.harga * newItem.jumlah
        }else{
            newItem.jumlah = 1
            newItem.harga = produkData.harga  
            newItem.subtotal = produkData.harga
            newItem.nama = produkData.nama
        }

        const newItems = {
            ...transaksi.items,
            [produkDoc.id]:newItem
        }

        if(newItem.jumlah > produkData.stock){
            enqueueSnackbar('Jumlah melebihi stock yang tersedia', {variant: 'error'})
        }else{
            setTransaksi({
                ...transaksi,
                items: newItems,
                total: Object.keys(newItems).reduce((total, k)=>{
                    const item = newItems[k]
                    return total + parseInt(item.subtotal)
                },0)
            })
        }


    }

    const handleChangeJumlah = k => e => {
        if(e.target.value < 0){
            enqueueSnackbar('Tidak boleh kurang dari 0', {variant: 'error'})
        }else{
            let newItem = {...transaksi.items[k]}
            newItem.jumlah = parseInt(e.target.value)
            newItem.subtotal = newItem.harga * newItem.jumlah
            
            const newItems = {
                ...transaksi.items,
                [k]:newItem
            }
    
            const produkDoc = produkItems.find(item=>item.id === k)
            const produkData = produkDoc.data()
            if(newItem.jumlah > produkData.stock){
                enqueueSnackbar('Jumlah melebihi stock yang tersedia', {variant: 'error'})
            }else{
                setTransaksi({
                    ...transaksi,
                    items: newItems,
                    total: Object.keys(newItems).reduce((total, k)=>{
                        const item = newItems[k]
                        return total + parseInt(item.subtotal)
                    },0)
                })
            }   
        }
    }

    const simpanTransaksi = async (e) => {
        if(Object.keys(transaksi.items).length <= 0){
            enqueueSnackbar('Tidak ada Transaksi untuk disimpan',{variant: 'error'})
        }else{
            setSubmitting(true)
            try{
                await transaksiCol.add({
                    ...transaksi,
                    timestamp: Date.now()
                })

                await firestore.runTransaction(transaction=>{
                    const produkIDs = Object.keys(transaksi.items)
                    return Promise.all(produkIDs.map(produkId=>{
                        const produkRef = firestore.doc(`toko/${user.uid}/produk/${produkId}`)
                        return transaction.get(produkRef).then(
                            (produkDoc)=>{
                                if(!produkDoc.exists){
                                    throw Error('Produk Tidak Ada')
                                }

                                let newStok = parseInt(produkDoc.data().stock) - parseInt(transaksi.items[produkId].jumlah)
                                if(newStok < 0){
                                    newStok = 0
                                }

                                transaction.update(produkRef, {stock: newStok})
                            }
                        )
                    }))
                })

                enqueueSnackbar('Transaksi berhasil disimpan',{variant: 'success'})
                setTransaksi(transaksi=>({
                    ...initialTransaksi,
                    no: transaksi.no
                }))
            }catch(e){
                enqueueSnackbar(e.message,{variant: 'error '})    
            }
            setSubmitting(false)
        }
    }

    if(loadingProduk || loadingTransaksi){
        return <AppPageLoading/>
    }

    return <>
        <Typography variant="h5" component="h1" paragraph>
            Buat Transaksi Baru
        </Typography>
        <Grid container spacing={5}>
            <Grid item xs>
                <TextField 
                    label="No Transaksi"
                    value={transaksi.no}
                    InputProps={
                        {readOnly: true}
                    }
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={simpanTransaksi} disabled={isSubmitting}><SaveIcon className={classes.iconLeft}/>Simpan Transaksi</Button>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={12} md={8}>
                <Table>
                    <TableHead>
                        <TableCell>Item</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Harga</TableCell>
                        <TableCell>Subtotal</TableCell>
                    </TableHead>
                    <TableBody>
                    {
                            Object.keys(transaksi.items).map(k=>{
                                const item = transaksi.items[k]
                                return (
                                    <TableRow key={k}>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell><TextField className={classes.inputJumlah} onChange={handleChangeJumlah(k)} value={item.jumlah} type="number"  disabled={isSubmitting}/></TableCell>
                                        <TableCell>{currency(item.harga)}</TableCell>
                                        <TableCell>{currency(item.subtotal)}</TableCell>
                                    </TableRow>
                                )
                            })
                        }

                        <TableRow colSpan={3}>
                            <TableCell><Typography variant="subtitle2">Total</Typography></TableCell>
                            <TableCell><Typography variant="h6">{currency(transaksi.total)}</Typography></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
            <Grid item xs={12} md={4}>
                <List 
                    className={classes.produkList}
                    component="nav"
                    subheader = {
                        <ListSubheader component="div">
                            <TextField
                                autoFocus
                                label="Cari Produk"
                                fullWidth
                                margin="normal"
                                onChange={e=>{
                                    setFilterProduk(e.target.value)
                                }}
                            />
                        </ListSubheader>
                    }
                >
                    {
                        produkItems.map((produkDoc)=>{
                            const produkData = produkDoc.data()
                            return <ListItem key={produkDoc.id} button disabled={!produkData.stock || isSubmitting} onClick={addItem(produkDoc)}>
                                {
                                    produkData.foto?
                                    <ListItemAvatar>
                                        <Avatar src={produkData.foto} alt={produkData.nama}/>
                                    </ListItemAvatar>
                                    :
                                    <ListItemIcon>
                                        <ImageIcon/>
                                    </ListItemIcon>
                                }
                                
                                <ListItemText primary={produkData.nama} secondary={`Stock :  ${produkData.stock || 0}`}/>
                            </ListItem>
                        })
                    }
                </List>
            </Grid>
        </Grid>
    </>
}

export default Home;