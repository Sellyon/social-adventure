import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, Card, CardContent, TextField,CardActions } from '@material-ui/core/';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CircularProgress from '@material-ui/core/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleDelete = () => {
    console.log('delete')
  };

  return (
    <div>
      <Button title="Lire l'actu" color="primary" onClick={handleClickOpen}>
        {props.news.content.slice(0, 50)+"..."}<OpenInBrowserIcon/>
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{props.news.title}</DialogTitle>
        <DialogContent>
          <h2>par {props.news.author}</h2>
          <h3><ScheduleIcon/>{Math.round((Date.now()-props.news.date)/3600000)}h</h3>
          <DialogContentText id="alert-dialog-slide-description">
            {props.news.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button title="Commenter" onClick={() => props.checkUser('warning','Vous devez être connecté pour commenter une actu.', handleOpenForm)} color="primary">
            <CommentIcon/>
          </Button>
          <Button title="Liker" onClick={() => props.checkUser('warning','Vous devez être connecté pour liker une actu.', props.handleLike, props.news)} color="primary">
            {props.loadRequest ? <CircularProgress color='secondary' size={20} thickness={2}/> :
              props.checkUserLike(props.news) ? <FavoriteIcon/> : 
              <FavoriteBorderIcon/>} ({props.news.likes.length})
          </Button>
          {props.userDatas && props.userDatas.connected && (props.userDatas.profil === props.news.author || props.userDatas.admin) &&
          <Button title="Effacer l'actu" onClick={handleDelete} color="primary">
            <DeleteIcon/>
          </Button>}
        </DialogActions>
      {props.news.comments && props.news.comments.length > 0 &&
        props.news.comments.map(function(comment, i){
          return(
            <Card key={i} style={{ boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0, 0, 0, 0.9)' }}>
              <CardContent>
                <Typography variant="h5" component="h3" style={{display:'inline-block'}}>{comment.author}</Typography>
                <Typography variant="subtitle1" style={{display:'inline-block'}}>
                  {Math.round(Date.now()-comment.date) > 3600000 ? (' · ' + Math.round((Date.now()-comment.date)/3600000) + 'h') :
                  (' · ' + Math.round((Date.now()-comment.date)/60000) + 'mn')}
                </Typography>
                <Typography>
                  {comment.content}
                </Typography>
              </CardContent>
              <CardActions>
                <Button title="Liker" onClick={() => props.checkUser('warning','Vous devez être connecté pour liker une actu.', props.handleLikeComment, {news:props.news, comment:comment})} color="primary">
                  {props.loadRequest ? <CircularProgress color='secondary' size={20} thickness={2}/> :
                    props.checkUserLike(comment) ? <FavoriteIcon/> : 
                    <FavoriteBorderIcon/>} ({comment.likes.length})
                </Button>
                {props.userDatas && props.userDatas.connected && (props.userDatas.profil === comment.author || props.userDatas.admin) &&
                <Button title="Effacer l'actu" onClick={handleDelete} color="primary">
                  <DeleteIcon/>
                </Button>}
              </CardActions>
            </Card>
          )
        })
      }
      </Dialog>
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Commenter l'actu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.news.content}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="commentValue"
            label="Commenter"
            type="text"
            onChange={ props.updateCommentValue }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => props.handleComment(props.commentValue, props.news, handleCloseForm) } color="primary">
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