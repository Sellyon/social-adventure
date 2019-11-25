import React from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, Avatar } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
/*import CommentIcon from '@material-ui/icons/Comment';
import ScheduleIcon from '@material-ui/icons/Schedule';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import GroupIcon from '@material-ui/icons/Group';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';*/
import CircularProgress from '@material-ui/core/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const deleteValidation = () => {
    handleCloseDelete();
    props.deleteUser(props.player.name, props.handleClose)
  };

  const checkIsConnected = () => {
    for (var i = 0; i < props.connectedPlayerList.length; i++) {
      if (props.connectedPlayerList[i].profil === props.player.name) {
        return true
      }
    }
    return false
  };

  return (
    <>
      {props.loadRequest && <CircularProgress color='secondary' size={80} thickness={2}/>}
      {!props.loadRequest && props.player &&
        <Dialog
          open={props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={props.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          scroll='body'
        >
          <DialogContent>
            <Grid container>
              <Grid item xs>
                <DialogTitle id={"alert-dialog-slide-title-"+props.player.name}>{props.player.name}</DialogTitle>
              </Grid>
              <Grid item xs>
                <Avatar alt={"Avatar de " + props.player.name} src={props.player.avatar} />
              </Grid>
              {props.connectedPlayerList.length > 0 && checkIsConnected() ? (
                <Grid item xs>
                  <Typography variant="h6" component="h4" style={{ color:'#0ddb23' }}>Joueur connecté</Typography>
                </Grid>
                ) : (
                <Grid item xs>
                  <Typography variant="h6" component="h4" style={{ color:'#e6150b' }}>Joueur déconnecté</Typography>
                </Grid>
                )
              }
            </Grid>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h6" component="h4">Sa description :</Typography>
              {props.player.description.length > 0 ? props.player.description :
                <i>Ce joueur ne possède pas de description</i>}
              <Typography variant="h6" component="h4">Ses amis :</Typography>
              {props.player.friends.length === 0 ?
                (<i>Ce joueur ne possède pas encore d\'amis</i>) : (<span>Ce joueur a {props.player.friends.length} amis</span>)
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {props.userDatas && props.userDatas.connected && (props.userDatas.profil === 'Sellyon' || props.userDatas.profil === props.player.name) &&
            <Button title="Supprimer ce compte" onClick={() => setOpenDelete(true)} color="primary">
              <DeleteIcon/>
            </Button>}
          </DialogActions>
        </Dialog>
      }
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id={"delete-title-"+props.player.name}>Suppression du compte "{props.player.name}"</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Voulez-vous vraiment supprimer ce compte ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteValidation} color="primary">
            Valider
          </Button>
          <Button onClick={handleCloseDelete} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}