import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pengguna from './pengguna';
import Toko from './toko';
import { Tabs, Tab, Paper } from '@material-ui/core'
import useStyles from './styles/index'

function Pengaturan(props) {
    const { location, history } = props

    const handleChangeTab = (event, value) => {
        history.push(value)
    }

    const classes = useStyles()

    return (
        <Paper square>
            <Tabs value={location.pathname} indicatorColor="primary" textColor="primary" onChange={handleChangeTab}>
                <Tab label="Pengguna" value="/pengaturan/pengguna" />
                <Tab label="Toko" value="/pengaturan/toko" />
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/pengaturan/pengguna" component={Pengguna} />
                    <Route path="/pengaturan/toko" component={Toko} />
                    <Redirect to="/pengaturan/pengguna" />
                </Switch>
            </div>
        </Paper>
    )
}

export default Pengaturan;
