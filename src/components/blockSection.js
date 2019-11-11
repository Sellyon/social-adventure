import React from 'react';
import News from './news';
import { Paper, Typography, Grow, Grid, Button } from '@material-ui/core/';
import AddCommentIcon from '@material-ui/icons/AddComment';
import clsx from 'clsx';

export default function PaperSheet(props) {

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

  const openPublishForm = () => {
    console.log(props.userDatas.profil+' veut publier une actu')
  }

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
              <Button title="Publier une actu" onClick={() => props.checkUser('warning','Vous devez être connecté pour publier une actu.', openPublishForm)}><AddCommentIcon style={{height:'48px', width:'48px', color:'#9B49FF'}}/></Button>
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