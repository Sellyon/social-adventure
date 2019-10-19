import React from 'react';
import { makeStyles, Grid } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  footerWrapper: {
    position: 'absolute',
    width: '100%',
    bottom: '0px',
    left: '0px',
  },
  footerDeco: {
    backgroundImage: 'url("/images/footer/footer.png")',
    backgroundRepeat: 'repeat-x',
    height: '52px',
  },
  footerBack: {
    backgroundColor: 'rgb(155, 73, 255)',
    height: '120px',
  },
  socialIconContainer: {
    width: '52px',
    height: '50px',
    backgroundImage: 'url(/images/footer/social-icons-round.png)',
    backgroundSize: 'cover',
  },
  socialIconWrapper: {
    maxWidth: '300px',
    margin: 'auto',
    paddingTop: '25px',
  },

}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footerWrapper}>
      <div className={classes.footerDeco}></div>
      <div className={classes.footerBack}>
        <Grid container spacing={1} className={classes.socialIconWrapper}>
          <Grid item xs={3} style={{ margin: 'auto' }}>
            <div className={classes.socialIconContainer} style={{backgroundPositionX: '-50px'}}></div>
          </Grid>
          <Grid item xs={3} style={{ margin: 'auto' }}>
            <div className={classes.socialIconContainer} style={{backgroundPositionX: '-203px'}}></div>
          </Grid>
          <Grid item xs={3} style={{ margin: 'auto' }}>
            <div className={classes.socialIconContainer} style={{backgroundPositionX: '-254px'}}></div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}