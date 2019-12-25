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

function Registrasi() {
    const classes = useStyle()
    const [form, setFrom] = useState({
        email: '',
        password: '',
        ulangi_password: ''
    })

    const [error, setError] = useState({
        email: '',
        password: '',
        ulangi_password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { auth, user, loading } = useFirebase()

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

        if (!form.password) {
            newError.password = 'Password wajib diisi'
        }

        if (!form.ulangi_password) {
            newError.ulangi_password = 'Ulangi Password wajib diisi'
        } else if (form.ulangi_password !== form.password) {
            newError.ulangi_password = 'Ulangi Password tidak sama dengan Password'
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

                await auth.createUserWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {}
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newError.email = "Email sudah terdaftar"
                        break;
                    case 'auth/invalid-email':
                        newError.email = "Email tidak valid"
                        break;
                    case 'auth/weak-password':
                        newError.password = "Password lemah"
                        break;
                    case 'auth/operation-not-allowed':
                        newError.email = "Method email dan password tidak didukung"
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
                <Typography variant="h5" component="h1" className={classes.title}>Buat Akun Baru</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField id="email" type="email" name="email" margin="normal" label="Alamat Email" value={form.email} onChange={handleChange} helperText={error.email} error={error.email ? true : false} disabled={isSubmitting} fullWidth required />
                    <TextField id="password" type="password" name="password" margin="normal" label="Password" value={form.password} onChange={handleChange} helperText={error.password} error={error.password ? true : false} disabled={isSubmitting} fullWidth required />
                    <TextField id="ulangi_password" type="password" name="ulangi_password" margin="normal" label="Ulangi Password" value={form.ulangi_password} onChange={handleChange} helperText={error.ulangi_password} error={error.ulangi_password ? true : false} disabled={isSubmitting} fullWidth required />
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button type="submit" color="primary" variant="contained" size="large">Register</Button>
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

export default Registrasi