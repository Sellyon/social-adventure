import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Icon, Grid, Button } from '@material-ui/core/';
import NewsContent from './newsContent';
import ReactSwipe from 'react-swipe';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ScheduleIcon from '@material-ui/icons/Schedule';

class News extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      loadingNews: true,
      arrowColorLeft: '#ccc9c9',
      arrowColorRight: '#9b49ff',
    };
  }

componentDidMount() {
  let that=this;
  setTimeout(function(){
    that.setState({
      loadingNews: false,
    });
  }, 300);
}
  render() {
    const { newsList, isLoading, loadingErrorMessage, newsSelected } = this.props;

    const noNews = (
      <div>
        <h3>Aucune news publiée récemment !</h3>
        <p>Soyez le premier à en poster une :)</p>
      </div>
    );

    let reactSwipeEl;

    const swipeArea = (
      <div>
        <ReactSwipe
          className="carousel"
          swipeOptions={{ continuous: false }}
          ref={el => (reactSwipeEl = el)}
        >
          {newsList && newsList.length > 0 && 
          newsList.map(
            function(news, index) {
              return (
                <div key={index}>
                  <h3>{news.title}</h3>
                  <h4>par {news.author}</h4>
                  <NewsContent news={news}/>
                  <p style ={{ display:'inline-block'}}><ScheduleIcon/>{Math.round((Date.now()-news.date)/3600000)}h</p>
                  <p style ={{ display:'inline-block',float: 'right'}}>
                  <Button title="Liker">
                    <FavoriteBorderIcon/>({news.likes.length})
                  </Button></p>
                </div>
              )
            }, this
          )}
        </ReactSwipe>
      </div>
    )

    const errorMessage = <span>{this.props.loadingErrorMessage}</span>;

    /*const testList=[0,1,2];

    const placeholderText = "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."

    const errorMessage = (
      <div>
        <ReactSwipe
          className="carousel"
          swipeOptions={{ continuous: false }}
          ref={el => (reactSwipeEl = el)}
        >
          {testList.map(
            function(news, index) {
              return (
                <div
                  key={index}
                >
                  <h3>News test n°{index}</h3>
                  <h4>par auteur bidon</h4>
                  <NewsContent
                    news={{title:"News test n°"+index,author:"auteur bidon",date:Math.round(Date.now()/3600000),likes:index,content:placeholderText,}}
                  />
                  <p style ={{ display:'inline-block'}}><ScheduleIcon/>{Math.round(Date.now()/3600000)}h</p>
                  <p style ={{ display:'inline-block',float: 'right'}}>
                  <Button title="Liker">
                    <FavoriteBorderIcon/>({index})
                  </Button></p>
                </div>
              )
            }, this
          )}
        </ReactSwipe>
      </div>
    )*/

    const loadingMessage = (
      <div style ={{ textAlign: 'center', paddingTop: '10%', }}>
        <CircularProgress
        color='secondary'
        size={80}
        thickness={4}
      />
      </div>
    );

    return (
      <React.Fragment>
        <Grid container>
          {newsList && newsList.length > 0 &&
            <Grid item xs={1} style={{ marginTop:'80px' }}>
              <Icon style={{ marginBottom:'80px' }} onClick={() => {
                if (reactSwipeEl.getPos() > 0) {
                  reactSwipeEl.prev();
                  if (reactSwipeEl.getPos() === 0) {
                    this.setState({
                      arrowColorLeft: '#ccc9c9',
                    });
                  } else if (reactSwipeEl.getPos() === reactSwipeEl.getNumSlides() - 2) {
                    this.setState({
                      arrowColorRight: '#9b49ff',
                    });
                  }
                }
              }}><ArrowBackIosIcon style={{ color:this.state.arrowColorLeft }}/>
              </Icon>
            </Grid>
          }
          <Grid item xs={10}>
            {
              this.state.loadingNews ? loadingMessage : 
              loadingErrorMessage !== null ? errorMessage :
              isLoading ? loadingMessage :
              newsList && newsList.length > 0 ? swipeArea :
              noNews
            }
          </Grid>
          {newsList && newsList.length > 0 &&
            <Grid item xs={1} style={{ marginTop:'80px' }}>
              <Icon onClick={() => {
                if (reactSwipeEl.getPos() < reactSwipeEl.getNumSlides()) {
                  reactSwipeEl.next();
                  if (reactSwipeEl.getPos() === reactSwipeEl.getNumSlides()-1) {
                    this.setState({
                      arrowColorRight: '#ccc9c9',
                    });
                  } else if (reactSwipeEl.getPos() === 1) {
                    this.setState({
                      arrowColorLeft: '#9b49ff',
                    });
                  }
                }
              }}>
                <ArrowForwardIosIcon  style={{ color:this.state.arrowColorRight }}/></Icon>
            </Grid>
          }
        </Grid>
      </React.Fragment>
    );
  }
}

export default News;