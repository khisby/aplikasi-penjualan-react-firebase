import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(theme=>({
    pengaturanToko: {
        display: 'flex',
        flexDirection: 'column',
        width: 300
    },
    actionButton: {
        marginTop: theme.spacing(13),
        marginLeft: theme.spacing(-25)
    }
}))

export default useStyles