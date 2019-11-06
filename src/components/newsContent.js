import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core/';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import ScheduleIcon from '@material-ui/icons/Schedule';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          <Button title="Commenter" onClick={handleClose} color="primary">
            <CommentIcon/>
          </Button>
          <Button title="Liker" onClick={handleClose} color="primary">
            <FavoriteBorderIcon/> ({props.news.likes.length})
          </Button>
          <Button title="Effacer l'actu" onClick={handleClose} color="primary">
            <DeleteIcon/>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}