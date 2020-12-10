import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import {Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Home} from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import React, {useState} from "react";
import {useStyles} from "./styles";
import history from '../../history'
import {store} from "../../redux/store";
import {resetUser} from "../../redux/reducer/userReducer";
import {deleteToken} from "../../redux/reducer/tokenReducer";
import {setAlert} from "../../redux/reducer/signInReducer";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Favorites from "./favorites";
import About from "./about";
import Box from "@material-ui/core/Box";


function MyProfile() {

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const logOut = () => {
        store.dispatch(resetUser())
        store.dispatch(deleteToken())
        store.dispatch(setAlert({alert: 'Sign out completed!', isSuccess: true}))
        history.push('/signIn')
    }

    const onClickHome = () => {
        history.push('/dashboard')
    }

    return (
        <Grid container className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Box display='flex' flexGrow={1} className={classes.box}>
                        <IconButton id="account" onClick={onClickHome}>
                            <Home style={{color: 'white'}}/>
                        </IconButton>
                        <IconButton aria-label="show 11 new notifications"
                                    color="inherit">
                            <Badge badgeContent={0} /* todo imposta il numero di notifiche*/ color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton onClick={logOut}>
                            <MeetingRoomIcon style={{color: 'white'}}/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.bottomNavigation}
            >
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon/>}/>
                <BottomNavigationAction label="Add" icon={<AddCircleOutlineIcon/>}/>
                <BottomNavigationAction label="About" icon={<AccountBoxIcon/>}/>
            </BottomNavigation>

            {value === 0 && <Favorites/>}
            {/*{value === 1 && <AddContent/>}*/}
            {value === 2 && <About/>}

        </Grid>
    )
}

export default MyProfile;

