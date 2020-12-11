import React, {useState} from 'react'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TitleIcon from "@material-ui/icons/Title";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Button from "@material-ui/core/Button";
import {Alert} from "@material-ui/lab";
import SaveIcon from "@material-ui/icons/Save";
import {makeStyles} from "@material-ui/core/styles";
import MovieIcon from '@material-ui/icons/Movie';

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

function Actors() {

    const classes = useStyles()

    // State contents
    const [field, setField] = useState({
        title: '',
        popularity: '',
        department: '',
        image: null
    })

    const [error, setError] = useState({
        title: false,
        popularity: false,
        department: false,
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
            setAlertImg({...alertImg, text: 'Image loaded correctly!'})
        } else {
            setAlertImg({...alertImg, isError: true, text: "Image not loaded!"})
        }
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setError({
            ...error,
            title: field.title === '',
            department: field.department === '',
            popularity: (field.popularity === '' || (parseFloat(field.popularity) > 100 || parseFloat(field.popularity) < 0)),
            image: field.image === null
        })

        if (field.image === null) {
            setAlertImg({...alertImg, isError: true, text: 'Image not loaded!'})
        }

        if (!error.title && !error.department && !error.popularity && field.image !== null) {
            console.log('[ON SUBMIT]')
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
                        error={error.popularity}
                        helperText={error.popularity ? 'Popularity must not be empty and not greater than 100' : ''}
                        autoComplete="fpopularity"
                        type={"number"}
                        name="popularity"
                        variant="standard"
                        required
                        fullWidth
                        id="popularity"
                        label="Popularity"
                        autoFocus
                        value={field.popularity}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <ThumbUpIcon/>
                                </InputAdornment>
                            ), inputProps: {min: 0, max: 100, step: 0.1}
                        }}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} className={classes.contText}>
                    <TextField
                        error={error.department}
                        helperText={error.department ? 'Department must not be empty' : ''}
                        autoComplete="fdepartment"
                        name="department"
                        variant="standard"
                        required
                        fullWidth
                        id="department"
                        label="Department"
                        autoFocus
                        value={field.department}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MovieIcon/>
                                </InputAdornment>
                            ),
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

export default Actors