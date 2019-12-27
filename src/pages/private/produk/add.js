import React, { useState } from 'react'
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'
import { useFirebase } from '../../../components/FirebaseProvider' 
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'

function AddDialog({history, open, handleClose}){
    const {firestore, user} = useFirebase()
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)
    const [nama, setNama] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)

    const handleSimpan = async e=>{
        
        setSubmitting(true)
        try{
            if(!nama){
                throw new Error("Nama Produk wajib diisi")
            }
            const produkBaru = await produkCol.add({nama})
            history.push(`/produk/edit/${produkBaru.id}`)
        }catch(e){
            setError(e.message)
        }
        
        setSubmitting(false)
    }
    return <Dialog open={open} onClose={handleClose} disableBackdropClick={isSubmitting} disableEscapeKeyDown={isSubmitting}>
        <DialogTitle>Buat Produk Baru</DialogTitle>
        <DialogContent dividers>
            <TextField id="nama" label="Nama Produk" value={nama} onChange={(e)=>{
                setError('') 
                setNama(e.target.value)}} helperText={error} error={error?true:false} disabled={isSubmitting}/>
        </DialogContent>
        <DialogActions>
            <Button disabled={isSubmitting} onClick={handleClose}>Batal</Button>
            <Button onClick={handleSimpan} color="primary" disabled={isSubmitting}>Simpan</Button>
        </DialogActions>
    </Dialog>
}

    AddDialog.propTypes = {
        open: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired
    }

export default withRouter(AddDialog);