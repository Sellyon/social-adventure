import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import API from './api';
import Snackbar from './snackbar';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://yoannmroz.yj.fr/">
        Yoann Mroz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarStatus, setSnackbarStatus] = React.useState('info');

  function snackbarHandleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }

  function checkEmail(email) {
    //Test email validity
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(email)) {
      return true
    } else {
      setErrorEmail(true);
      return false
    }
  }

  async function submission(e) {
    e.preventDefault()
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    if (checkEmail(email)) {
      try {
        // Load async data.
        const result = await API.post('/login', {request:'login', email: email, password:password});
        if(result.data === 'OK') {
          window.location.href="/";
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage(result.data);
          setSnackbarStatus('error')
        }
      } catch (e) {
        setSnackbarOpen(true);
        setSnackbarMessage(`😱 Axios request failed: ${e}`);
        setSnackbarStatus('error')
      }
    } else {
      setSnackbarOpen(true);
      setSnackbarMessage('email invalide');
      setSnackbarStatus('error')
      setErrorEmail(true)
    }
  }
  
  async function passwordReminder(e) {
    e.preventDefault()
    const email = document.getElementById('email').value;

    if (checkEmail(email)) {
      try {
        // Load async data.
        const result = await API.post('/login', {request:'reminder', email: email});
        if(result.data === 'OK') {
          setSnackbarOpen(true);
          setSnackbarMessage('Votre demande a été analysée et acceptée ! Vous avez reçu un rappel de vos identifiants dans votre boite mail 😺');
          setSnackbarStatus('success')
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage(result.data);
          setSnackbarStatus('error')
        }
      } catch (e) {
        setSnackbarOpen(true);
        setSnackbarMessage(`😱 Axios request failed: ${e}`);
        setSnackbarStatus('error')
      }
    } else {
      setSnackbarOpen(true);
      setSnackbarMessage('email invalide');
      setSnackbarStatus('error')
      setErrorEmail(true)
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Fab color="secondary" aria-label="edit" href="/" size="small">
                <ArrowBackIcon />
              </Fab>
              <Typography component="h1" variant="button">
                Retour
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Connexion
              </Typography>
            </Grid>
          </Grid>
          <form
            className={classes.form}
            noValidate
            onSubmit={ (e) => submission(e)}
          >
            <TextField
              variant="outlined"
              margin="normal"
              error={errorEmail}
              onChange={ () => setErrorEmail(false) }
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Connexion
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={ (e) => passwordReminder(e) }>
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Pas de compte ? En un ici <span role="img" aria-label="smiley">🙂</span>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
      <Snackbar
        handleClose={snackbarHandleClose}
        open={snackbarOpen}
        message={snackbarMessage}
        status={snackbarStatus}
      />
    </>
  );
}