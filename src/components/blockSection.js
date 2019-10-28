import React from 'react';
import News from './news';
import { makeStyles, Paper, Typography, Grow } from '@material-ui/core/';

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
      mainTitle: 'Les News',
      mainTexte: 'Les dernières news',
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
    <div style={{height:props.imageHeight, minHeight:"250px"}}>
    <Grow in={props.checked}>
      <Paper className={classes.root} style={{height:props.imageHeight, minHeight:"250px", boxSizing:'border-box'}}>
        <Typography variant="h5" component="h3">
          {elements[props.selectedMenu].mainTitle}
        </Typography>
        <Typography component="p">
          {elements[props.selectedMenu].mainTexte}
        </Typography>
        {getContent()}
      </Paper>
    </Grow>
    </div>
  );
}