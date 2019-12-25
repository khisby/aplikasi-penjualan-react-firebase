import React from 'react';
import { useFirebase } from '../../../components/FirebaseProvider';
import Button from '@material-ui/core/Button'

function Home() {
    const { auth } = useFirebase()
    return <>
        <h1> Halaman Home </h1>
        <Button onClick={(e) => {
            auth.signOut()
        }} >Logout</Button>
    </>
}

export default Home;