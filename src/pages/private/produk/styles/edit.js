import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(theme=>({
    hideInputFile: {
        display: 'none'
    },
    upload:{
        textAlign: 'center',
        padding: theme.spacing(3)
    },
    previewFoto: {
        width: '100%',
        height: 'auto'
    },
    iconLeft:{
        marginRight: theme.spacing(1) 
    },
    actionButton:{
        paddingTop: theme.spacing(2)
    }
}))

export default useStyles