import React, { useEffect, useState } from 'react'
import {Fab, Grid, Card, CardMedia, CardContent, CardActions, Typography} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import useStyles from './styles/grid'
import AddDialog from './add'
import { useFirebase } from '../../../components/FirebaseProvider'
import {useCollection} from 'react-firebase-hooks/firestore'
import AppPageLoading from '../../../components/AppPageLoading'
import ImageIcon from '@material-ui/icons/Image'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import {currency} from '../../../utils/formatter'
import {Link} from 'react-router-dom'

function GridProduk(){
    const classes = useStyles()
    const {firestore, storage, user} = useFirebase() 
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)
    const [snapshot, loading] = useCollection(produkCol)
    const [openDialog, setOpenDialog] = useState(false)
    const [produkItems, setProdukItems] = useState([])

    useEffect(()=>{
        if(snapshot){
            setProdukItems(snapshot.docs)
        }
    },[snapshot])

    if(loading){
        return <AppPageLoading/>
    }

    const handleDelete = produkDoc=> async e => {
        if(window.confirm('Apakah Anda yakin ingin menghapus Produk ini?')){
            await produkDoc.ref.delete()
            const fotoURL = produkDoc.data().foto
            if(produkDoc.data().foto){
                storage.refFromURL(fotoURL).delete()
            }
        }
    }

    return <>
        <Typography variant="h5" component="h1" paragraph> Daftar Produk </Typography>
            {produkItems.length <= 0 && <Typography>Belum ada data Produk</Typography>}
            <Grid container spacing={5}>
                {
                    produkItems.map((produkDoc)=>{
                        const produkData = produkDoc.data()
                        return <Grid key={produkDoc.id} item={true} xs={12} sm={12} md={6} lg={4}>
                            <Card className={classes.card}>
                                {
                                    produkData.foto &&
                                    <CardMedia className={classes.foto} image={produkData.foto} title={produkData.nama}/>
                                }
                                {
                                    !produkData.foto &&
                                    <div className={classes.fotoPlaceHolder}>
                                        <ImageIcon size="large" color="disabled"/>
                                    </div>
                                }
                                <CardContent className={classes.produkDetails}>
                                    <Typography variant="h5" noWrap>{produkData.nama}</Typography>
                                    <Typography variant="subtitle1">Harga : {currency(produkData.harga)}</Typography>
                                    <Typography>Stock : {produkData.stock}</Typography>
                                </CardContent>
                                <CardActions className={classes.produkActions}>
                                    <IconButton component={Link} to={`/produk/edit/${produkDoc.id}`}>
                                        <EditIcon/>
                                    </IconButton>
                                    
                                    <IconButton onClick={handleDelete(produkDoc)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>

        <Fab className={classes.fab} color="primary" onClick={(e)=>{setOpenDialog(true)}}><AddIcon/></Fab>

        <AddDialog open={openDialog} handleClose={()=>{
            setOpenDialog(false)
        }}/>
    </>
}

export default GridProduk;