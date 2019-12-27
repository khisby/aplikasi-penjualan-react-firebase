import React, { useState } from 'react'
import {Fab} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import useStyles from './styles/grid'
import AddDialog from './add'

function GridProduk(){
    const classes = useStyles()
    const [openDialog, setOpenDialog] = useState(false)

    return <>
        <h1> Halaman Grid Produk </h1>
        <Fab className={classes.fab} color="primary" onClick={(e)=>{setOpenDialog(true)}}><AddIcon/></Fab>

        <AddDialog open={openDialog} handleClose={()=>{
            setOpenDialog(false)
        }}/>
    </>
}

export default GridProduk;