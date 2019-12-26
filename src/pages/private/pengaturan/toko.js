import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core'
import useStyles from './styles/toko'
import isUrl from 'validator/lib/isURL'
import { useFirebase } from '../../../components/FirebaseProvider';

function Toko() {
    const classes = useStyles()
    const {firestore, user} = useFirebase()
    const tokoDoc = firestore.doc(`toko/${user.uid}`)
    const [form, setForm] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: '',
    })
    const [error, setError] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: '',
    })
    const [isSubmitting, setSubmitting] = useState(false)

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            [e.target.name]:''
        })
    }

    const validate = ()=>{
        const error = {...form}
        if(!form.nama){
            error.nama = 'Nama wajib diisi'
        }

        if(!form.alamat){
            error.alamat = 'Alamat wajib diisi'
        }

        if(!form.telepon){
            error.telepon = 'Telepon wajib diisi'
        }

        if(!form.website){
            error.website = 'Website wajib diisi'
        }else if(!isUrl(form.website)){
            error.website = 'Website tidak valid'
        }
        return error
    }

    const handleSubmit = async e=>{
        e.preventDefault()
        const findError = validate()
        console.log(findError)
        if(Object.values(findError).some(err=>err!=='')){
            setError(findError)
        }else{
            
            setSubmitting(true)
            try{
                await tokoDoc.set(form, {marge:true})
            }catch(e){
                
            }
            setSubmitting(false)
        }

    }


    return <>
        <div className={classes.pengaturanToko}>
            <form onSubmit={handleSubmit} noValidate>
                <TextField id="nama" name="nama" label="Nama Toko" margin="normal" value={form.nama} onChange={handleChange} error={error.nama?true:false} helperText={error.nama} disabled={isSubmitting} required/>
                <TextField id="alamat" name="alamat" label="Alamat" margin="normal" value={form.alamat} onChange={handleChange} error={error.alamat?true:false} helperText={error.alamat} disabled={isSubmitting} required/>
                <TextField id="telepon" name="telepon" label="Nomor Telepon" margin="normal" value={form.telepon} onChange={handleChange} error={error.telepon?true:false} helperText={error.telepon} disabled={isSubmitting} required/>
                <TextField id="website" name="website" label="Website" margin="normal" value={form.website} onChange={handleChange} error={error.website?true:false} helperText={error.website} disabled={isSubmitting} required/>
                <Button variant="contained" type="submit" color="primary" disabled={isSubmitting} className={classes.actionButton}>Simpan</Button>
            </form>
        </div>
    </>
}

export default Toko;