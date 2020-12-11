import React, {useState} from 'react'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TitleIcon from '@material-ui/icons/Title';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import LanguageIcon from '@material-ui/icons/Language';
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import {Alert} from "@material-ui/lab";
import {requestNewContents} from "../../../../requests/content/newContents";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    contText: {
        marginTop: theme.spacing(5)
    },
    form: {
        width: '100%',
    },
    input: {
        display: 'none',
    },
    button: {
        marginTop: theme.spacing(4),
    },
    alert: {
        marginTop: theme.spacing(2)
    }
}));

function MoviesTvContents() {

    const classes = useStyles()
    const userId = useSelector(state => state.user.id)

    // State contents
    const [field, setField] = useState({
        title: '',
        date: '',
        language: '',
        vote: '',
        image: null
    })

    const [error, setError] = useState({
        title: false,
        date: false,
        language: false,
        vote: false,
        image: false
    })

    const [alertImg, setAlertImg] = useState({
        text: '',
        isError: false
    })

    const onChange = (event) => {
        const {name, value} = event.target
        setField({...field, [name]: value})
    }

    const onImageChange = (event) => {
        if (event.target.files[0]) {
            const img = event.target.files[0]
            setField({...field, image: URL.createObjectURL(img)})
            setAlertImg({...alertImg, isError: false, text: 'Image loaded correctly!'})
        } else {
            setAlertImg({...alertImg, isError: true, text: "Image not loaded!"})
        }
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setError({
            ...error,
            title: field.title === '',
            date: field.date === '',
            language: field.language === '',
            vote: (field.vote === '' || (parseFloat(field.vote) > 10 || parseFloat(field.vote) < 0)),
            image: field.image === null
        })

        if (field.image === null) {
            setAlertImg({...alertImg, isError: true, text: 'Image not loaded!'})
        }
        if (!error.title && !error.date && !error.language && !error.vote && field.image !== null) {
            requestNewContents.added(userId, field).then((res) => {
                console.log("RES "+res.data)
            }).catch((err) => {
                console.log("ERR "+err.response.data.message)
            })
        }
    }

    return (
        <Grid container justify={'center'}>
            <form noValidate className={classes.form} onSubmit={onSubmit}>
                <Grid item xs={12} className={classes.contText}>
                    <TextField
                        error={error.title}
                        helperText={error.title ? 'Title must not be empty' : ''}
                        autoComplete="ftitle"
                        name="title"
                        variant="standard"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        autoFocus
                        value={field.title}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TitleIcon/>
                                </InputAdornment>
                            ),
                        }}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} className={classes.contText}>
                    <TextField
                        error={error.date}
                        helperText={error.date ? 'Release date must not be empty' : ''}
                        type={"date"}
                        autoComplete="freleaseDate"
                        name="date"
                        variant="standard"
                        required
                        fullWidth
                        id="releaseDate"
                        label="Release Date"
                        autoFocus
                        value={field.date}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DateRangeIcon/>
                                </InputAdornment>
                            ),
                        }}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} className={classes.contText}>
                    <TextField
                        error={error.language}
                        helperText={error.language ? 'Language must not be empty' : ''}
                        autoComplete="flanguage"
                        name="language"
                        variant="standard"
                        required
                        fullWidth
                        id="language"
                        label="Language"
                        autoFocus
                        value={field.language}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LanguageIcon/>
                                </InputAdornment>
                            ),
                        }}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} className={classes.contText}>
                    <TextField
                        error={error.vote}
                        helperText={error.vote ? 'Vote must not be empty and not greater than 10' : ''}
                        autoComplete="fvote"
                        type={"number"}
                        name="vote"
                        variant="standard"
                        required
                        fullWidth
                        id="vote"
                        label="Vote"
                        autoFocus
                        value={field.vote}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <ThumbUpIcon/>
                                </InputAdornment>
                            ), inputProps: {min: 0, max: 10, step: 0.1}
                        }}
                        onChange={onChange}
                    />
                </Grid>
                <Grid container justify={'center'} spacing={2}>
                    <Grid item xs={6}>
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={onImageChange}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span" className={classes.button}>
                                Upload
                            </Button>
                        </label>
                    </Grid>
                    {alertImg.text &&
                    <Alert severity={alertImg.isError ? 'error' : 'success'} className={classes.alert}
                           variant="standard">
                        {alertImg.text}
                    </Alert>}
                </Grid>
                <Grid container justify={'center'}>
                    <Grid item xs={6}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            value={"submit"}
                            startIcon={<SaveIcon/>}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default MoviesTvContents;