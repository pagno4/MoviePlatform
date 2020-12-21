import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import {Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Home} from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import React, {useEffect, useState} from "react";
import history from '../../history'
import {store} from "../../redux/store";
import {resetUser} from "../../redux/reducer/userReducer";
import {deleteToken} from "../../redux/reducer/tokenReducer";
import {setAlert} from "../../redux/reducer/signInReducer";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Favorites from "./bottomBavigation/favorites";
import About from "./bottomBavigation/about";
import AddContents from "./bottomBavigation/addContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {socket} from "../../requests/socket";
import {eventNotice} from "../../redux/reducer/socketReducer";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    bottomNavigation: {
        width: 500,
        marginTop: theme.spacing(3),
    },
    homeIcon: {
        marginLeft: theme.spacing(1)
    },
    divider: {
        marginTop: theme.spacing(3)
    }
}));


function MyProfile() {

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const name = useSelector(state => state.user.name)
    const notice = useSelector(state => state.socket.notice)

    useEffect(() => {
        socket.on('notice new content added', (id) => {
            store.dispatch(eventNotice(id))
        })
    },[])

    const logOut = () => {
        store.dispatch(resetUser())
        store.dispatch(deleteToken())
        socket.disconnect()
        store.dispatch(setAlert({alert: 'Sign out completed!', isSuccess: true}))
        history.push('/signIn')
    }

    const onClickHome = () => {
        history.push('/dashboard')
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        {"Hi " + name + ", "}
                    </Typography>
                    <IconButton id="account" onClick={onClickHome} className={classes.homeIcon}>
                        <Home style={{color: 'white'}}/>
                    </IconButton>
                    <IconButton aria-label="show 11 new notifications"
                                color="inherit">
                        <Badge badgeContent={notice} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton onClick={logOut}>
                        <MeetingRoomIcon style={{color: 'white'}}/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Grid container justify={'center'}>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    showLabels
                    className={classes.bottomNavigation}
                >
                    <BottomNavigationAction label="Favorites" icon={<FavoriteIcon/>} href={'#favoriteContent'}/>
                    <BottomNavigationAction label="Add contents" icon={<AddCircleOutlineIcon/>}
                                            href={'#addContent'}/>
                    <BottomNavigationAction label="About" icon={<AccountBoxIcon/>} href={'#about'}/>
                </BottomNavigation>

                <Grid container justify={'center'}>
                    <Grid item xs={6} className={classes.divider}>
                        <Divider/>
                    </Grid>
                </Grid>

                {value === 0 && <Favorites/>}
                {value === 1 && <AddContents/>}
                {value === 2 && <About/>}
            </Grid>
        </div>
    )
}

export default MyProfile;

