import React from 'react'
import PropTypes from 'prop-types'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableRow, TableHead, TableBody, TableCell } from '@material-ui/core'
import {currency} from '../../../utils/formatter'

function DetailsDialog({ open, handleClose, transaksi }) {
    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Transaksi No:  {transaksi.no}</DialogTitle>
        <DialogContent dividers>
            <Table>
                <TableHead>
                    <TableCell>Item</TableCell>
                    <TableCell>Jumlah</TableCell>
                    <TableCell>Harga</TableCell>
                    <TableCell>Subtotal</TableCell>
                </TableHead>
                <TableBody>
                    {
                        transaksi.items && 
                        Object.keys(transaksi.items).map(k => {
                            const item = transaksi.items[k]
                            return (
                                <TableRow key={k}>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>{item.jumlah}</TableCell>
                                    <TableCell>{currency(item.harga)}</TableCell>
                                    <TableCell>{currency(item.subtotal)}</TableCell>
                                </TableRow>
                            )
                        })
                    }

                    <TableRow colSpan={3}>
                        <TableCell><Typography variant="subtitle2">Total</Typography></TableCell>
                        <TableCell><Typography variant="h6">{currency(transaksi.total)}</Typography></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
    </Dialog>
}

DetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    transaksi: PropTypes.object.isRequired
}

export default DetailsDialog