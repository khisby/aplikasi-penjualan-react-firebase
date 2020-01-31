import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(theme=>({
    produkList: {
        backgroundColor: theme.palette.background.paper,
        maxHeight: 500,
        overflow: 'auto'
    },
    inputJumlah: {
        width: 35
    }
}))

export default useStyles