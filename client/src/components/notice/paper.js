import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    paperNotice: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        backgroundColor: '#ecf3f9'
    }
}));

function PaperComponent(props) {

    const classes = useStyles()
    const notice = props.notice

    return (
        <Container component="main" maxWidth="xs" key={notice.id}>
            <Paper elevation={3} className={classes.paperNotice} key={notice.id}>
                <Typography variant="h6" gutterBottom>{"Content added: " + notice.title}</Typography>
                <Typography variant='body1' gutterBottom>{"Category: " + notice.category}</Typography>
                <Typography variant="button" display={'block'}>{"Added by " + notice.username}</Typography>
            </Paper>
        </Container>
    )
}

export default PaperComponent
