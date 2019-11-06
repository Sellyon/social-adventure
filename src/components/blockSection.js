import React from 'react';
import News from './news';
import { makeStyles, Paper, Typography, Grow, Grid, Button } from '@material-ui/core/';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function PaperSheet(props) {
  const classes = useStyles();

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
  ];

  const getContent = () => {
    // Les contenus

    // Les news
    if (props.selectedMenu === 0) {
      return <div>
        <News
          newsList={props.newsList}
          newsSelected={props.newsSelected}
          isLoading={props.isLoading}
          loadingErrorMessage={props.loadingErrorMessage}
          imageHeight={props.imageHeight}
        />
      </div>
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
  }

  return (
    <div style={{height:props.imageHeight, minHeight:"325px"}}>
    <Grow in={props.checked}>
      <Paper className={classes.root} style={{height:props.imageHeight, minHeight:"325px", boxSizing:'border-box'}}>
        <Grid container>
          <Grid item xs>
            <Typography variant="h5" component="h3">
              {elements[props.selectedMenu].mainTitle}
            </Typography>
          </Grid>
          {props.selectedMenu === 0 &&
            <Grid item xs>
              <Button title="Publier une actu" onClick={() => 0}><PublishIcon/></Button>
            </Grid>
          }
        </Grid>
        <Typography component="p">
          {elements[props.selectedMenu].mainTexte}
        </Typography>
        {getContent()}
      </Paper>
    </Grow>
    </div>
  );
}