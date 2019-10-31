import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactSwipe from 'react-swipe';

class News extends React.Component {
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
                <div
                  key={index}
                >
                  <h3>{news.title}</h3>
                  <h4>par {news.author}</h4>
                  <p style={{ display: "none" }}>{news.content}</p>
                  <p>publié depuis : {Math.round((Date.now()-news.date)/3600000)}h</p>
                  <p>likes : {news.likes.length}</p>
                </div>
              )
            }, this
          )}
        </ReactSwipe>
        <button onClick={() => reactSwipeEl.next()}>Next</button>
        <button onClick={() => reactSwipeEl.prev()}>Previous</button>
      </div>
    )

    const errorMessage = <span>{this.props.loadingErrorMessage}</span>;

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
      <div
        style={{ width: "90%", margin: "auto", }}
      >
        {
          loadingErrorMessage !== null ? errorMessage :
          isLoading ? loadingMessage : 
          newsList && newsList.length > 0 ? swipeArea :
          noNews
        }
      </div>
    );
  }
}

export default News;