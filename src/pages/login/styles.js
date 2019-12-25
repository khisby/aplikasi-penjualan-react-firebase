import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles(theme => ({
    title: {
        // color: theme.palette.primary.main
        textAlign: 'center',
        marginBottom: theme.spacing(3), 
    },
    paper: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(6)
    },
    buttons: {
        marginTop: theme.spacing(6)
    },
    lupaPassword: {
        marginTop: theme.spacing(3)
    }
}))

export default useStyle;