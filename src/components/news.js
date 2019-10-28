import React from "react";

import { Paper } from '@material-ui/core/';

class News extends React.Component {
  render() {
    const { newsList, isLoading, loadingErrorMessage, newsSelected } = this.props;

    const noNews = (
      <div>
        <h3>Aucune news publiée récemment !</h3>
        <p>Soyez le premier à en poster une :)</p>
      </div>
    );

    const newsDetails = (
      <div>
        <h3>{newsList && newsList.length > 0 && newsList[newsSelected].title}</h3>
        <h4>par {newsList && newsList.length > 0 && newsList[newsSelected].author}</h4>
        <p style={{ display: "none" }}>{newsList && newsList.length > 0 && newsList[newsSelected].content}</p>
        <p>publié le : {newsList && newsList.length > 0 && newsList[newsSelected].date}</p>
        <p>likes : {newsList && newsList.length > 0 && newsList[newsSelected].likes.length}</p>
      </div>
    );

    const errorMessage = <span>{this.props.loadingErrorMessage}</span>;

    const loadingMessage = <span>Loading...</span>;

    console.log(isLoading)

    return (
      <div
        style={{ width: "90%", margin: "auto" }}
      >
        {
          loadingErrorMessage !== null ? errorMessage :
          isLoading ? loadingMessage : 
          newsList && newsList.length > 0 ? newsDetails :
          noNews
        }
      </div>
    );
  }
}

export default News;