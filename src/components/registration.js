import React from 'react';
import { Avatar, Button, CssBaseline, TextField, Checkbox, Radio, RadioGroup, Link, Grid, Box, Typography, makeStyles, Container, FormControlLabel, FormControl, FormLabel, Fab } from '@material-ui/core/';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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

const gameTypList = [
  {id: 'pref_aventure', label: 'aventure'},
  {id: 'pref_puzzle', label: 'Puzzle'},
  {id: 'pref_shooter', label: 'Shooters'},
  {id: 'pref_strategie', label: 'Stratégie'},
  {id: 'pref_mmo', label: 'MMO (jeu en ligne massivement multijoueur)'},
  {id: 'pref_plateformer', label: 'Plateformer'},
  {id: 'pref_simulation', label: 'Simulation (sport, aviation...)'},
  {id: 'pref_pointNClick', label: 'Point\'n\'Click'},
  {id: 'pref_retro', label: 'Jeux retro'},
  {id: 'pref_rpg', label: 'Jeux de Rôle'},
  {id: 'pref_interactiveDrama', label: 'Interactive Drama'},
  {id: 'pref_battleRoyal', label: 'Battle Royal'},
]

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function Registration(props) {
  const [valueGender, setValueGender] = React.useState('female');
  const [valuePlayStyle, setValuePlayStyle] = React.useState('casual');
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorFirstName, setErrorFirstName] = React.useState(false);
  const [errorLastName, setErrorLastName] = React.useState(false);
  const [errorPseudo, setErrorPseudo] = React.useState(false);
  const [errorDate, setErrorDate] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarStatus, setSnackbarStatus] = React.useState('info');
  const [getDatas, setGetDatas] = React.useState(false);
  const classes = useStyles();

  const [state, setState] = React.useState({
    valueDescription:'',
    valueFirstName:'',
    valueLastName:'',
    valuePseudo:'',
    valueBirthday:'',
    datasLoaded: false,
    pref_aventure: false,
    pref_puzzle: false,
    pref_shooter: false,
    pref_strategie: false,
    pref_mmo: false,
    pref_plateformer: false,
    pref_simulation: false,
    pref_pointNClick: false,
    pref_retro: false,
    pref_rpg: false,
    pref_interactiveDrama: false,
    pref_battleRoyal: false
  });

  (async function isTherePlayerDatas() {
    const url = new URL(window.location);
    if(url.search.length) {
      const searchParams = new URLSearchParams(url.search);
      if(searchParams.has('getDatas')) {
        if (!getDatas) {
          setGetDatas(true);
          try {
            let message;
            let status;
            // Load async data.
            const data = await API.post('/', {request:'getNewsAndUsers'});
            if(data.data) {
              const playerList = data.data.dataUsers;
              const playerName = searchParams.get('getDatas');
              let player=null;
              for (var i = 0; i < playerList.length; i++) {
                if (playerList[i].name === playerName) {
                  player = playerList[i];
                }
              }
              if (player !== null) {
                setValueGender(player.gender);
                setValuePlayStyle(player.playStyle);
                setState({ 
                  'valueDescription':player.description,
                  'valueFirstName':player.firstName,
                  'valueLastName':player.lastName,
                  'valuePseudo':player.name,
                  'valueBirthday':player.birthday,
                  'datasLoaded':true,
                }, () => {
                  for (var i = 0; i < player.preferencesList.length; i++) {
                    [player.preferencesList[i]] = 'true';
                  }
                });

                message = 'Vous pouvez modifier ici vos données personnelles 😺';
                status = 'info'
              } else {
                message = 'Cet utilisateur n\'existe pas 🙀';
                status = 'error'
              }
            } else {
              message = 'Le remplissage de formulaire a échoué 🙀';
              status = 'error'
            }
            setSnackbarOpen(true);
            setSnackbarMessage(message);
            setSnackbarStatus(status)
          } catch (e) {
            setSnackbarOpen(true);
            setSnackbarMessage(`😱 Axios request failed: ${e}`);
            setSnackbarStatus('error')
          }
        }
      }
    }
  }())

  function snackbarHandleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }

  const preCheck = (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const pseudo = document.getElementById('pseudo').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const pref_aventure = document.getElementById('pref_aventure').value;
    const pref_puzzle = document.getElementById('pref_puzzle').value;
    const pref_shooter = document.getElementById('pref_shooter').value;
    const pref_strategie = document.getElementById('pref_strategie').value;
    const pref_mmo = document.getElementById('pref_mmo').value;
    const pref_plateformer = document.getElementById('pref_plateformer').value;
    const pref_simulation = document.getElementById('pref_simulation').value;
    const pref_pointNClick = document.getElementById('pref_pointNClick').value;
    const pref_retro = document.getElementById('pref_retro').value;
    const pref_rpg = document.getElementById('pref_rpg').value;
    const pref_interactiveDrama = document.getElementById('pref_interactiveDrama').value;
    const pref_battleRoyal = document.getElementById('pref_battleRoyal').value;
    const gender = valueGender;
    const playStyle = valuePlayStyle;
    let status = 'success';
    let message = null;

    //Test email validity
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(email)) {
    } else {
      setErrorEmail(true);
      status = 'error'
      message = 'email invalide'
    }

    //Test password validity
    const passwordRegex = /\d/;
    if (password.length >= 6 && passwordRegex.test(password)) {
    } else {
      setErrorPassword(true);
      status = 'error'
      message = 'mot de passe invalide'
    }

    //Test birthday validity
    const birthDayRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (birthDayRegex.test(date)) {
    } else {
      setErrorDate(true);
      status = 'error'
      message = 'date de naissance invalide'
    }

    //Test first name validity
    if (firstName.length >= 1) {
    } else {
      setErrorFirstName(true);
      status = 'error'
      message = 'champ prénom vide'
    }

    //Test last name validity
    if (lastName.length >= 1) {
    } else {
      setErrorLastName(true);
      status = 'error'
      message = 'champ nom de famille vide'
    }

    //Test pseudo validity
    if (pseudo.length >= 3 && pseudo.length <= 24) {
    } else {
      setErrorPseudo(true);
      status = 'error'
      if (pseudo.length < 3) {
        message = 'pseudo trop court ('+pseudo.length+' caractères, il en faut minimum 3)'
      } else {
        message = 'pseudo trop long ('+pseudo.length+' caractères, il en faut maximum 24)'
      }
    }

    //Test description validity
    if (state.valueDescription.length === 0 || state.valueDescription.length <= 430) {
    } else {
      status = 'error'
      message = 'description trop long ('+state.valueDescription.length+' caractères, il en faut maximum 430)'
    }

    if (status !== 'success') {
      setSnackbarOpen(true);
      setSnackbarMessage(message);
      setSnackbarStatus(status)
    } else {
      const registerPack = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        pseudo: pseudo,
        birthday: date,
        description: state.valueDescription,
        pref_aventure: pref_aventure,
        pref_puzzle: pref_puzzle,
        pref_shooter: pref_shooter,
        pref_strategie: pref_strategie,
        pref_mmo: pref_mmo,
        pref_plateformer: pref_plateformer,
        pref_simulation: pref_simulation,
        pref_pointNClick: pref_pointNClick,
        pref_retro: pref_retro,
        pref_rpg: pref_rpg,
        pref_interactiveDrama: pref_interactiveDrama,
        pref_battleRoyal: pref_battleRoyal,
        gender: gender,
        playStyle: playStyle,
      }
      sendRequest(registerPack)
    }
  }

  const sendMail = async function(registerPack, code) {
    console.log('try to send mail')
    const name = registerPack.pseudo;
    const email = registerPack.email;
    const password = registerPack.password;
    let status;
    let message;
    try {
      // Load async data.
      const result = await API.post('/register', {request:'sendMail',name:name,email: email, code:code, password: password});
      if(result.data === 'OK') {
        message = 'Votre compte a été créé, veuillez valider l\'inscription en répondant au mail qui vous a été envoyé 😺';
        status = 'success'
      } else {
        message = 'L\'envoi de mail a échoué 🙀';
        status = 'error'
      }
      setSnackbarOpen(true);
      setSnackbarMessage(message);
      setSnackbarStatus(status)
    } catch (e) {
      setSnackbarOpen(true);
      setSnackbarMessage(`😱 Axios request failed: ${e}`);
      setSnackbarStatus('error')
    }
  }

  const sendRequest = async function (registerPack) {
    try {
      // Load async data.
      let request
      if (state.datasLoaded) {
        request = 'updateAccount'
      } else {
        request = 'subscribe'
      }
      let playerName;
      const url = new URL(window.location);
      if(url.search.length) {
        const searchParams = new URLSearchParams(url.search);
        if(searchParams.has('getDatas')) {
          playerName = searchParams.get('getDatas');
        }
      }
      const result = await API.post('/register', {request:request,registerPack:registerPack,nameInURL:playerName});
      console.log('pouet')
      if(result.data.status === 'OK') {
        if (state.datasLoaded) {
          setSnackbarOpen(true);
          setSnackbarMessage('Votre compte à été mis à jour avec succès 😺');
          setSnackbarStatus('success')
        } else {
          console.log('send mail')
          sendMail(registerPack, result.data.code);
        }
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
  }

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const handleChangeCheck = name => event => {
    setState({ ...state, [name]: event.target.value });
  };

  const handleChangeRadio = (type, event) => {
    if (type === 'setValueGender') {
      setValueGender(event.target.value);  
    } else if (type === 'setValuePlayStyle') {
      setValuePlayStyle(event.target.value);  
    }
  };

  return (
    <>
    {getDatas && !state.datasLoaded ? (
      <div className={classes.root}>
        <CircularProgress size={80} color="secondary" style={{ position: 'absolute',left:'45vw',top:'45vh' }} />
      </div>
      ) : (
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
              {state.datasLoaded ? (
              <Typography component="h1" variant="h5">
                Votre compte
              </Typography>
              ) : (
              <Typography component="h1" variant="h5">
                Inscription
              </Typography>
              )
            }
            </Grid>
          </Grid>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  defaultValue={state.valueFirstName}
                  fullWidth
                  disabled={state.datasLoaded}
                  id="firstName"
                  label="Prénom"
                  autoFocus
                  onClick={ () => setErrorFirstName(false)}
                  error={errorFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  disabled={state.datasLoaded}
                  id="lastName"
                  defaultValue={state.valueLastName}
                  label="Nom"
                  name="lastName"
                  autoComplete="lname"
                  onClick={ () => setErrorLastName(false)}
                  error={errorLastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  onClick={ () => setErrorEmail(false)}
                  error={errorEmail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="pseudo"
                  label="Votre pseudo"
                  defaultValue={state.valuePseudo}
                  name="pseudo"
                  onClick={ () => setErrorPseudo(false)}
                  helperText="entre 3 et 24 caractères."
                  error={errorPseudo}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onClick={ () => setErrorPassword(false)}
                  helperText="minimun 6 caractères, dont au moins 1 chiffre."
                  error={errorPassword}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign:"center" }}>
                <TextField
                  name="birthday"
                  id="date"
                  helperText="Date de naissance"
                  type="date"
                  disabled={state.datasLoaded}
                  defaultValue={state.valueBirthday}
                  onClick={ () => setErrorDate(false)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errorDate}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Votre genre</FormLabel>
                  <RadioGroup disabled={state.datasLoaded} aria-label="gender" id="gender" name="gender" value={valueGender} onChange={(e) => handleChangeRadio('setValueGender',e)}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}><FormControlLabel value="female" control={<Radio />} label="Femme" /></Grid>
                    <Grid item xs={12} sm={4}><FormControlLabel value="male" control={<Radio />} label="Homme" /></Grid>
                    <Grid item xs={12} sm={4}><FormControlLabel value="other" control={<Radio />} label="Autre" /></Grid>
                  </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Votre profil de joueur</FormLabel>
                  <RadioGroup disabled={state.datasLoaded} aria-label="playStyle" id="playStyle" name="playStyle" value={valuePlayStyle} onChange={(e) => handleChangeRadio('setValuePlayStyle',e)}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}><FormControlLabel value="casual" control={<Radio />} label="Casual" /></Grid>
                    <Grid item xs={12} sm={4}><FormControlLabel value="midcore" control={<Radio />} label="Midcore" /></Grid>
                    <Grid item xs={12} sm={4}><FormControlLabel value="hardcore" control={<Radio />} label="Hardcore" /></Grid>
                  </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Vos types de jeux préférés</FormLabel>
                  {gameTypList && gameTypList.length > 0 &&
                    gameTypList.map(function(gameType, i){
                      return(
                        <FormControlLabel
                          key={i}
                          control={<Checkbox checked={state[gameType.id]} onChange={handleChange(gameType.id)} id={gameType.id} name={gameType.id} value={state[gameType.id]} />}
                          label={gameType.label}
                        />
                    )})}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="description"
                  id="description"
                  label="Votre description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  multiline={true}
                  rows={4}
                  defaultValue={state.valueDescription}
                  error={state.valueDescription.length > 430}
                  onChange={handleChangeCheck("description")}
                  helperText="Au maximum 430 caractères."
                />
              </Grid>
            </Grid>
            {state.datasLoaded ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={ (e) => preCheck(e)}
            >
              Mettre à jour
            </Button>
              ) : (
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={ (e) => preCheck(e)}
              >
                S'inscrire
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Vous avez déjà un compte? Connectez-vous
                  </Link>
                </Grid>
              </Grid>
            </>
            )}
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
      )}
      <Snackbar
        handleClose={snackbarHandleClose}
        open={snackbarOpen}
        message={snackbarMessage}
        status={snackbarStatus}
      />
    </>
  );
}