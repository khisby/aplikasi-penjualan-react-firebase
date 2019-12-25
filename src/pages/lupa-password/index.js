import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import useStyle from './styles'
import { Typography, TextField, Grid } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import isEmail from 'validator/lib/isEmail'
import { useFirebase } from '../../components/FirebaseProvider'
import AppLoading from '../../components/AppLoading'
import {useSnackbar} from 'notistack'

function LupaPassword() {
    const classes = useStyle()
    const [form, setFrom] = useState({
        email: ''
    })

    const [error, setError] = useState({
        email: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { auth, user, loading } = useFirebase()

    const {enqueueSnackbar} = useSnackbar()

    const handleChange = e => {
        setFrom({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const validate = () => {
        const newError = { ...error }
        if (!form.email) {
            newError.email = 'Email wajib diisi'
        } else if (!isEmail(form.email)) {
            newError.email = "Email tidak valid"
        }

        return newError
    }
    const handleSubmit = async e => {
        e.preventDefault()
        const findError = validate()
        if (Object.values(findError).some(err => err !== '')) {
            setError(findError)
        } else {
            try {
                setIsSubmitting(true)
                const actionCodeSettings = {
                    url: `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email,actionCodeSettings )
                enqueueSnackbar(`Cek kotak masuk email : ${form.email}, sebuah tautan untuk me-reset password telah dikirim`, {variant: 'success'})
                setIsSubmitting(false)
            } catch (e) {
                const newError = {}
                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = "Email tidak terdaftar"
                        break;
                    case 'auth/invalid-email':
                        newError.email = "Email tidak valid"
                        break;

                    default:
                        newError.email = "Terjadi Kesalahan, Coba lagi!"
                        break;
                }
                setError(newError)
                setIsSubmitting(false)
            }
        }

    }

    if(loading){
        return <AppLoading/>
    }

    if(user){
        return <Redirect to="/"/>
    }

    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography variant="h5" component="h1" className={classes.title}>Lupa Password</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField id="email" type="email" name="email" margin="normal" label="Alamat Email" value={form.email} onChange={handleChange} helperText={error.email} error={error.email ? true : false} disabled={isSubmitting} fullWidth required />
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button type="submit" color="primary" variant="contained" size="large">Kirim</Button>
                        </Grid>

                        <Grid item>
                            <Button component={Link} to="/login" variant="contained" size="large">Login</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default LupaPassword 