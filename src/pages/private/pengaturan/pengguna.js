import React, { useRef, useState } from 'react';
import {TextField} from '@material-ui/core'
import { useFirebase } from "../../../components/FirebaseProvider";
import { useSnackbar } from 'notistack';

function Pengguna(){
    const {user} = useFirebase()
    const displayNameRef = useRef()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState({displayName: ''})
    const {enqueueSnackbar} = useSnackbar()

    const saveDisplayName = async (e) => {
        const displayName = displayNameRef.current.value

        if(!displayName){
            setError({displayName: 'Nama wajib diisi'})
        }else if(displayName !== user.displayName){
            setError({
                displayName: ''
            })
            setIsSubmitting(true)
            await user.updateProfile({
                displayName
            })
            setIsSubmitting(false)    
            enqueueSnackbar('Data Pengguna berhasil diperbarui', {variant: 'success'})
        }else{
            setError({
                displayName: ''
            })
        }
    }

    return <>
        <TextField id="displayName" name="displayName" label="Nama" defaultValue={user.displayName} inputProps={{ref:displayNameRef, onBlur: saveDisplayName}} disabled={isSubmitting} helperText={error.displayName} error={error.displayName?true:false}/>
    </>
}

export default Pengguna;