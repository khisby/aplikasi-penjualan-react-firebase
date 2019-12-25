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

function Login(props) {
    const {location} = props
    const classes = useStyle()
    const [form, setFrom] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState({
        email: '',
        password: ''
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

                await auth.signInWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {}
                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = "Email tidak ditemukan"
                        break;
                    case 'auth/invalid-email':
                        newError.email = "Email tidak valid"
                        break;
                    case 'auth/wrong-password':
                        newError.password = "Password salah"
                        break;
                    case 'auth/user-disabled':
                        newError.email = "Akun diblokir"
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

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        const redirectTo =  location.state && location.state.from && location.state.from.pathname ? location.state.from.pathname : '/'
        return <Redirect to={redirectTo} />
    }

    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography variant="h5" component="h1" className={classes.title}>Login</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField id="email" type="email" name="email" margin="normal" label="Alamat Email" value={form.email} onChange={handleChange} helperText={error.email} error={error.email ? true : false} disabled={isSubmitting} fullWidth required />
                    <TextField id="password" type="password" name="password" margin="normal" label="Password" value={form.password} onChange={handleChange} helperText={error.password} error={error.password ? true : false} disabled={isSubmitting} fullWidth required />
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button type="submit" color="primary" variant="contained" size="large">Login</Button>
                        </Grid>

                        <Grid item>
                            <Button component={Link} to="/registrasi" variant="contained" size="large">Daftar</Button>
                        </Grid>
                    </Grid>
                    

                    <div className={classes.lupaPassword}>
                        <Typography component={Link} to="/lupa-password">
                            Lupa password
                    </Typography>
                    </div>
                </form>
            </Paper>
        </Container>
    )
}

export default Login