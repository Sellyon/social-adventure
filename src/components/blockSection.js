import React from 'react';
import News from './news';
import UsersSection from './usersSection';
import { Paper, Typography, Grow, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core/';
import AddCommentIcon from '@material-ui/icons/AddComment';
import clsx from 'clsx';

export default function PaperSheet(props) {
  const [openForm, setOpenForm] = React.useState(false);
  const [formTitleValue, setFormTitleValue] = React.useState('');
  const [formContentValue, setFormContentValue] = React.useState('');
  const elements = [
    {
      mainTitle: 'Les Actus',
      mainTexte: 'Les dernières actus...',
    }, 
    {
      mainTitle: 'Social RPG',
      mainTexte: 'le jeu d\'aventures fun et social',
    },
    {
      mainTitle: 'Les jeux',
      mainTexte: 'Le catalogue de jeux',
    },
    {
      mainTitle: 'Les joueurs',
      mainTexte: 'Faites ici des rencontres avec les joueurs connectés !',
    },
  ];

  const getContent = () => {
    // Les contenus

    // Les news
    if (props.selectedMenu === 0) {
      return <>
        <News
          deleteNews={props.deleteNews}
          deleteComment={props.deleteComment}
          loadRequest={props.loadRequest}
          handleLike={props.handleLike}
          handleComment={props.handleComment}
          userDatas={props.userDatas}
          checkUser={props.checkUser}
          newsList={props.newsList}
          newsSelected={props.newsSelected}
          isLoading={props.isLoading}
          loadingErrorMessage={props.loadingErrorMessage}
          imageHeight={props.imageHeight}
          handleLikeComment={props.handleLikeComment}
        />
      </>
    }

    // Social RPG
    if (props.selectedMenu === 1) {
      return <div>
        pouet pouet
      </div>
    }

    // Le catalogue de jeux
    if (props.selectedMenu === 2) {
      return <div>
        <a href="/lobby">Cubekatraz</a> 
      </div>
    }

    // Le catalogue de jeux
    if (props.selectedMenu === 3) {
      return <div>
        <UsersSection
          loadRequest={props.loadRequest}
          deleteUser={props.deleteUser}
          loadingErrorMessage={props.loadingErrorMessage}
          loadingUserList={props.loadingUserList}
          allPlayerList={props.allPlayerList}
          connectedPlayerList={props.connectedPlayerList}
          checkUser={props.checkUser}
          userDatas={props.userDatas}
        />
      </div>
    }
  }

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div className='ScalableHeight' style={{height:props.imageHeight}}>
    <Grow in={props.checked}>
      <Paper className={clsx('classes.root','ScalableHeight')} style={{height:props.imageHeight, boxSizing:'border-box'}}>
        <Grid container>
          <Grid item xs>
            <Typography variant="h5" component="h3">
              {elements[props.selectedMenu].mainTitle}
            </Typography>
          </Grid>
            {props.selectedMenu === 0 &&
            <Grid item xs>
              <Button title="Publier une actu" onClick={() => props.checkUser('warning','Vous devez être connecté pour publier une actu.', handleOpenForm)}><AddCommentIcon style={{height:'48px', width:'48px', color:'#9B49FF'}}/></Button>
            </Grid>
            }
        </Grid>
        <Typography component="p">
          {elements[props.selectedMenu].mainTexte}
        </Typography>
        {getContent()}
      </Paper>
    </Grow>
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Ecrire une actu</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="titleValue"
            label="Titre de l'actu"
            type="text"
            onChange={ (e) => setFormTitleValue(e.target.value) }
            fullWidth
            multiline
            error={formTitleValue.length > 50}
            helperText="minimun 1 caractère, au maximum 50."
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            id="newsValue"
            label="Votre message"
            type="text"
            onChange={ (e) => setFormContentValue(e.target.value) }
            fullWidth
            variant="outlined"
            multiline={true}
            rows={4}
            error={formContentValue.length > 430}
            helperText="minimun 1 caractère, au maximum 430."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={ () => {props.addNews({title:formTitleValue, content:formContentValue}, handleCloseForm)} }
            color="primary">
            Valider
          </Button>
          <Button onClick={handleCloseForm} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}