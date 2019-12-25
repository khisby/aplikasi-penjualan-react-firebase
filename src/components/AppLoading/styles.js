import {makeStyles} from '@material-ui/styles'

const useStyle = makeStyles(theme=>({
    title: {
        color: theme.palette.primary.main,
        textAlign: 'center'
    },
    loadingBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh'
    }
}))

export default useStyle