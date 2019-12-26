import React, { useRef, useState } from 'react';
import { TextField, Button, Typography } from '@material-ui/core'
import { useFirebase } from "../../../components/FirebaseProvider";
import { useSnackbar } from 'notistack';
import { isEmail } from 'validator'
import useStyles from './styles/pengguna'

function Pengguna() {
    const { user } = useFirebase()
    const displayNameRef = useRef()
    const displayEmailRef = useRef()
    const PasswordRef = useRef()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState({ displayName: '' })
    const { enqueueSnackbar } = useSnackbar()
    const classes = useStyles()

    const saveDisplayName = async (e) => {
        const displayName = displayNameRef.current.value

        if (!displayName) {
            setError({ displayName: 'Nama wajib diisi' })
        } else if (displayName !== user.displayName) {
            setError({
                displayName: ''
            })
            setIsSubmitting(true)
            await user.updateProfile({
                displayName
            })
            setIsSubmitting(false)
            enqueueSnackbar('Data Pengguna display name berhasil diperbarui', { variant: 'success' })
        } else {
            setError({
                displayName: ''
            })
        }
    }


    const updateEmail = async (e) => {
        const email = displayEmailRef.current.value

        if (!email) {
            setError({ email: 'Email wajib diisi' })
        } else if (!isEmail(email)) {
            setError({ email: 'Email tidak valid' })
        } else if (email !== user.email) {
            setError({
                email: ''
            })
            setIsSubmitting(true)

            try {
                await user.updateEmail(email)

                enqueueSnackbar('Data Pengguna Email berhasil diperbarui', { variant: 'success' })
            } catch (e) {
                let emailError = ''
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = 'Email sudah digunakan'
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email tidak valid'
                        break;
                    case 'auth/requires-recent-login':
                        emailError = 'Anda harus login kembali'
                        break;
                    default:
                        emailError = 'Terjadi kesalahan. silahkan coba lagi!'
                        break;
                }
                setError({
                    email: emailError
                })

            }

            setIsSubmitting(false)
        } else {
            setError({
                email: ''
            })
        }
    }

    const updatePassword = async (e) => {
        const password = PasswordRef.current.value

        if (!password) {
            setError({ password: 'Password wajib diisi' })
        }else if (password !== user.password) {
            setError({
                password: ''
            })
            setIsSubmitting(true)

            try {
                await user.updatePassword(password)
                enqueueSnackbar('Data Pengguna password berhasil diperbarui', { variant: 'success' })
            } catch (e) {
                let errorPassword = ''
                switch (e.code) {
                    case 'auth/weak-password':
                        errorPassword = 'Email terlalu lemah'
                        break;
                    case 'auth/requires-recent-login':
                        errorPassword = 'Anda harus login kembali'
                        break;
                    default:
                        errorPassword = 'Terjadi kesalahan. silahkan coba lagi!'
                        break;
                }
                setError({
                    password: errorPassword
                })

            }

            setIsSubmitting(false)
        } else {
            setError({
                password: ''
            })
        }
    }

    const handlerEmailVerification = async (e)=>{
        const actionCodeSettings = {
            url: `${window.location.origin}/login`
        }

        setIsSubmitting(true)
        await user.sendEmailVerification(actionCodeSettings)
        enqueueSnackbar('Email verifikasi telah dikirim', {variant: 'success'})
        setIsSubmitting(false)
    }
    return <>
        <div className={classes.pengaturanPengguna}>
            <TextField id="displayName" name="displayName" label="Nama" defaultValue={user.displayName} inputProps={{ ref: displayNameRef, onBlur: saveDisplayName }} disabled={isSubmitting} helperText={error.displayName} error={error.displayName ? true : false} />
            <TextField id="email" name="email" label="Email" type="email" defaultValue={user.email} inputProps={{ ref: displayEmailRef, onBlur: updateEmail }} disabled={isSubmitting} helperText={error.email} error={error.email ? true : false} margin="normal" />

            {user.emailVerified? <Typography variant="subtitle1" color="primary">Email sudah terverifikasi</Typography> : <Button variant="outlined" color="primary" text="primary" onClick={handlerEmailVerification} disabled={isSubmitting}>Kirim Verifikasi Email</Button> }

            <TextField id="password" name="password" label="Password" type="password" defaultValue={user.password} inputProps={{ ref: PasswordRef, onBlur: updatePassword }} disabled={isSubmitting} helperText={error.password} error={error.password ? true : false} margin="normal" autoComplete="new-password" />
        </div>
    </>
}

export default Pengguna;