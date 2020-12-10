import React, {useState} from "react";
import {request} from '../../../requests/user'
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import {MdLocalMovies} from 'react-icons/md';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import {useStyles} from './styles'
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {signUpSuccess} from "../../../redux/reducer/userReducer";
import {store} from '../../../redux/store'
import history from '../../../history'
import {Alert} from "@material-ui/lab";
import {setTokenEmail} from "../../../redux/reducer/tokenReducer";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © ' + new Date().getFullYear() + '.'}
        </Typography>
    );
}

function SignUp() {

    const USERNAME = 'username'
    const EMAIL = 'email'
    const classes = useStyles();

    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    })
    const {name, username, password, email} = userData

    const [passwordFeatures, setPasswordFeatures] = useState({
        typePassword: false,
        typeVerifyPassword: false,
        verifyPassword: ''

    })
    const {typePassword, verifyPassword, typeVerifyPassword} = passwordFeatures

    const [infoAlert, setInfoAlert] = useState('')
    const [errorUsername, setErrorUsername] = useState(false)
    const [blankFieldUsername, setUsername] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorName, setErrorName] = useState(false)
    const [errorEmail, setErrorEmail] = useState({
        isError: false,
        text: ''
    })

    /**
     * Action to change username, email, name, password
     * @param event value
     */
    const onChange = event => {
        const {value, name} = event.target
        setUserData({...userData, [name]: value})

        // Actions to username
        if (name === USERNAME) {
            isUserValid(value).then(res => {
                if (!res) {
                    setErrorUsername(true)
                } else {
                    setErrorUsername(false)
                }
            })
        }
        // Actions for email
        else if (name === EMAIL) {
            isEmailFormatValid(value).then(res => {
                if (!res[0]) {
                    setErrorEmail({...errorEmail, isError: true, text: res[1]})
                } else {
                    isEmailValid(value).then((res) => {
                        if (!res) {
                            setErrorEmail({...errorEmail, isError: true, text: 'Email is already present!'})
                        } else {
                            setErrorEmail({...errorEmail, isError: false, text: ''})
                        }
                    })
                }
            })
        }
    }

    const onChangePasswordFeatures = event => {
        const {value, name} = event.target
        setPasswordFeatures({...passwordFeatures, [name]: value})
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    /**
     * Send name, username, email and password to create new user
     * @param event
     */
    const onSubmit = event => {
        event.preventDefault()

        isValidField(userData, setErrorName, setUsername, errorEmail, setErrorEmail)
        if (password && verifyPassword && password === verifyPassword) {

            setErrorPassword(false)
            setInfoAlert('')
            if (name && username && email && !errorUsername && !errorEmail.isError) {
                request.signUp(userData).then(res => {
                    store.dispatch(signUpSuccess(res.data.data))
                    store.dispatch(setTokenEmail(res.data.token))
                    history.push('/resendToken')
                }).catch(err => {
                        setInfoAlert(err.response.data.message)
                    }
                )
            }
        } else {
            setErrorPassword(true)
            if (!password || !verifyPassword) {
                setInfoAlert("Passwords can not be blank!")
            } else {
                setInfoAlert("Passwords doesn't match!")
            }
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    < MdLocalMovies/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                error={errorName}
                                helperText={errorName ? 'Name must not be empty' : ''}
                                autoComplete="fname"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={errorUsername ? true : blankFieldUsername}
                                helperText={errorUsername ? 'Username already present!' : blankFieldUsername ? 'Username must not be empty' : ''}
                                autoComplete="username"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                                value={username}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={errorEmail.isError}
                                helperText={errorEmail.text}
                                autoComplete="fname"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                autoFocus
                                value={email}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item>
                                <FormControl className={classes.formPassword} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={typePassword ? 'text' : 'password'}
                                        name="password"
                                        value={password}
                                        error={errorPassword}
                                        onChange={onChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        setPasswordFeatures({
                                                            ...passwordFeatures,
                                                            'typePassword': !typePassword
                                                        })
                                                    }}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {typePassword ? <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={82}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formPassword} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Repeat password *</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-verifyPassword"
                                        type={typeVerifyPassword ? 'text' : 'password'}
                                        name="verifyPassword"
                                        value={verifyPassword}
                                        error={errorPassword}
                                        onChange={onChangePasswordFeatures}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        setPasswordFeatures({
                                                            ...passwordFeatures,
                                                            'typeVerifyPassword': !typeVerifyPassword
                                                        })
                                                    }}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {typeVerifyPassword ? <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={137}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid container justify={"center"}>
                                {infoAlert !== '' &&
                                <Alert severity='error' variant="standard" className={classes.alert}>
                                    {infoAlert}
                                </Alert>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        value={"submit"}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href={'/signIn'} variant="body2" className={classes.link}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={10}>
                <Copyright/>
            </Box>
        </Container>
    );
}

/**
 * Check to show error
 */
function isValidField(userData, setErrorName, setErrorUsername, errorEmail, setErrorEmail) {
    const {name, username, email} = userData
    setErrorName(name === '')
    setErrorUsername(username === '')
    if (!errorEmail.isError) {
        setErrorEmail({...errorEmail, isError: email === '', text: email === '' ? 'Email must not be empty!' : ''})
    }
}

/**
 * Check if the email is format valid
 */
async function isEmailFormatValid(email) {
    const res = await request.isValidEmail(email)
    return [res.data.email, res.data.message]
}

/**
 * Check if the email is already present
 */
async function isEmailValid(email) {
    const users = await request.sameField("email", email)
    const usernameDb = users.data.data
    if (usernameDb !== []) {
        if (usernameDb.email === email) {
            return false
        }
    }
    return true
}

/**
 * Check if the username is already present
 */
async function isUserValid(username) {
    const users = await request.sameField("username", username)
    const usernameDb = users.data.data
    if (usernameDb !== []) {
        if (usernameDb.username === username) {
            return false
        }
    }
    return true
}

export default SignUp;
