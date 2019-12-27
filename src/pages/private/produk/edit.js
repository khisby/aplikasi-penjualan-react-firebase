import React, { useState, useEffect } from 'react';
import {TextField, Button, Grid, Typography} from '@material-ui/core'
import { useFirebase } from '../../../components/FirebaseProvider';
import {useDocument} from 'react-firebase-hooks/firestore/'
import AppPageLoading from '../../../components/AppPageLoading'
import { useSnackbar } from 'notistack';
import useStyles from './styles/edit'
import UploadIcon from '@material-ui/icons/CloudUpload'
import SaveIcon from '@material-ui/icons/Save'
import {Prompt} from 'react-router-dom'


function EditProduk({match}){
    const {firestore,user,storage} = useFirebase()
    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`)
    const produkStorageRef = storage.ref(`toko/${user.uid}/produk`)
    const [snapshot, loading] = useDocument(produkDoc)
    const [isSubmitting, setSubmitting] = useState(false)
    const {enqueueSnackbar} = useSnackbar()
    const classes = useStyles()
    const [isSomethingChange, setSomethingChange] = useState(false)

    const [form, setForm] = useState({
        nama: '',
        sku: '',
        harga: 0,
        stock: 0,
        deskripsi: ''
    })

    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stock: '',
        deskripsi: ''
    })

    useEffect(()=>{
        if(snapshot && snapshot.exists){
            setForm(currentForm=>({...currentForm,...snapshot.data()}))
        }
    },[snapshot])

    const handleChange = e=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            ...error,
            [e.target.name]: ''
        })

        setSomethingChange(true)
    }

    if(loading){
        return <AppPageLoading/>
    }

    const validate = e=>{
        const newError = {...error}
        if(!form.nama){
            newError.nama = "Nama Produk wajib diisi"
        }

        if(!form.harga){
            newError.harga = "Harga Produk wajib diisi"
        }

        if(!form.stock){
            newError.stock = "Stock Produk wajib diisi"
        }

        return newError
    }

    const handleSubmit = async e=>{
        e.preventDefault()
        const findError = validate()
        if(Object.values(findError).some(err=>err!=='')){
            setError(findError)
        }else{
            setSubmitting(true)
            try{
                await produkDoc.set(form,{merge:true})
                enqueueSnackbar("Data produk berhasil disimpan",{variant:'success'})
                setSomethingChange(false)
            }catch(e){
                enqueueSnackbar(e.message,{variant: 'error'})
            }
            setSubmitting(false)
        }
    }

    const handleUploadFile = async e=>{
        const file = e.target.files[0]
        if(!['image/png','image/jpeg'].includes(file.type)){
            setError(error=>({
                ...error,
                foto: `Tipe file tidak didukung: ${file.type}`
            }))
        }else if(file.size >= 512000){
            setError(error=>({
                ...error,
                foto: `Ukuran file terlalu besar > 500KB: ${file.size}`
            }))
        }else{
            const reader = new FileReader()
            reader.onabort = ()=>{
                setError(error=>({
                    ...error,
                    foto: `Pembacaan file dibatalkan`
                }))
            }

            reader.onerror = ()=>{
                setError(error=>({
                    ...error,
                    foto: `File reader tidak bisa dibaca`
                }))
            }

            reader.onload = async ()=>{
                setError(error=>({
                    ...error,
                    foto: ``
                }))
                setSubmitting(true)
                try{
                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'))
                    const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExt}`)

                    const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url')

                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL()
                    setForm(currentForm=>({
                        ...currentForm,
                        foto: fotoUrl
                    }))
                    setSomethingChange(true)
                }catch(e){
                    setError(error=>({
                        ...error,
                        foto: e.message
                    }))
                }
                
                setSubmitting(false)
            }

            reader.readAsDataURL(file)
        }
    }

    return <>
        <Typography variant="h5" component="h1">Edit Produk: {form.nama}</Typography>
        <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={6}>
                <form id="produk-form" onSubmit={handleSubmit} noValidate>
                    <TextField id="nama" name="nama" label="Nama Produk" margin="normal" value={form.nama} onChange={handleChange} helperText={error.nama} error={error.nama?true:false} fullWidth required disabled={isSubmitting}/>
                    <TextField id="sku" name="sku" label="SKU Produk" margin="normal" value={form.sku} onChange={handleChange} helperText={error.sku} error={error.sku?true:false} fullWidth disabled={isSubmitting}/>
                    <TextField id="harga" type="number" name="harga" label="Harga Produk" margin="normal" value={form.harga} onChange={handleChange} helperText={error.harga} error={error.harga?true:false} fullWidth required disabled={isSubmitting}/>
                    <TextField id="stock" type="number" name="stock" label="Stock Produk" margin="normal" value={form.stock} onChange={handleChange} helperText={error.stock} error={error.stock?true:false} fullWidth required disabled={isSubmitting}/>
                    <TextField id="deskripsi" name="deskripsi" label="Deskripsi Produk" margin="normal" value={form.deskripsi} onChange={handleChange} helperText={error.deskripsi} error={error.deskripsi?true:false} fullWidth multiline rowMax={3} disabled={isSubmitting}/>
                </form>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.upload}>
                    {form.foto && <img src={form.foto} className={classes.previewFoto} alt={`Foto Produk ${form.nama}`}/>}
                    <input type="file" className={classes.hideInputFile} id="upload-foto-produk" accept="image/jpeg,image/png" onChange={handleUploadFile}/>
                    <label htmlFor="upload-foto-produk"><Button component="span" variant="outlined" disabled={isSubmitting}><UploadIcon className={classes.iconLeft}/> Upload Foto Produk</Button></label>
                    {error.foto && <Typography color="error">{error.foto}</Typography>}
                </div>
            </Grid>
            
            <Grid item xs={12}>
                <div className={classes.actionButton}>
                <Button color="primary" type="submit" form="produk-form" variant="contained" disabled={isSubmitting || !isSomethingChange}><SaveIcon className={classes.iconLeft}/>Simpan</Button>
                </div>
            </Grid>
        </Grid>
        <Prompt when={isSomethingChange} message="Perubahan belum disimpan. Apakah Anda yakin untuk keluar?"/>
    </>
}

export default EditProduk;