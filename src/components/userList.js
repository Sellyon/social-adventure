import React from 'react';
import { Button, Grid, Dialog, Slide, Typography, Card, CardContent, CardActions, Avatar, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@material-ui/core/';
import UserPage from './userPage';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
/*import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';
import ScheduleIcon from '@material-ui/icons/Schedule';*/
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
/*import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import GroupIcon from '@material-ui/icons/Group';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AccessTimeIcon from '@material-ui/icons/AccessTime';*/
import CircularProgress from '@material-ui/core/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);
  const [openPlayer, setOpenPlayer] = React.useState(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [playerToDelete, setPlayerToDelete] = React.useState(null);

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setPlayerToDelete(null)
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePlayer = () => {
    setOpenPlayer(null);
  };

  const handleOpenProfile = (player) => {
    window.location.href="/profil/"+player
  }

  const deleteValidation = (player) => {
    handleCloseDelete();
    props.deleteUser(player, handleClosePlayer)
  };

  return (
    <div>
      <Typography component="p">
        {props.connectedPlayerList && props.connectedPlayerList.length > 0 &&
          'Il y a actuellement '+props.connectedPlayerList.length+' joueurs connectés'}
      </Typography>
      <Button title="Voir liste de joueurs connectés" color="primary" onClick={ handleOpen }>
        {"Voir la liste : "}<OpenInBrowserIcon/>
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-userList-slide-title"
        aria-describedby="alert-userList-slide-description"
        style={{width:'100%'}}
        scroll='body'
      >
        {props.loadRequest && <CircularProgress color='secondary' size={20} thickness={2}/>}
        {!props.loadRequest && props.listOfPlayerToShow && props.listOfPlayerToShow.length > 0 &&
          props.listOfPlayerToShow.map(function(player, i){
            return(
              <>
                <Card key={i} style={{ boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0, 0, 0, 0.9)' }}>
                  <Grid container>
                    <Grid item xs>
                      <CardContent>
                        <Grid container>
                          <Grid item xs>
                            <Avatar alt={"Avatar de " + player.name} src={player.avatar} />
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h5" component="h3">{player.name}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Grid>
                    <Grid item xs={6}>
                      <CardActions>
                      {props.userDatas && props.userDatas.connected && (props.userDatas.profil === 'Sellyon' || props.userDatas.profil === player.name) &&
                        <Button title="Supprimer ce compte" onClick={() => {
                          setOpenDelete(true)
                          setPlayerToDelete(player.name)
                        }} color="primary">
                          <DeleteIcon/>
                        </Button>
                      }
                      {props.userDatas && props.userDatas.profil !== player.name &&
                        <Button title="Voir profil" onClick={ () => props.checkUser('warning','Vous devez être connecté pour consulter un profil.', handleOpenProfile, player.name) }>
                          <VisibilityIcon style={{height:'24px', width:'24px', color:'#9B49FF'}}/>
                        </Button>
                      }
                      </CardActions>
                    </Grid>
                  </Grid>
                </Card>
              </>
            )
          })
        }
      </Dialog>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id={"delete-title"}>Suppression du compte "{playerToDelete}"</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Voulez-vous vraiment supprimer ce compte ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => deleteValidation(playerToDelete) } color="primary">
            Valider
          </Button>
          <Button onClick={handleCloseDelete} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}