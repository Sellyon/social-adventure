import React from 'react';
import API from './components/api';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ImageButn from './components/imageButn';
import BlockSection from './components/blockSection';
import Snackbar from './components/snackbar';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import GroupIcon from '@material-ui/icons/Group';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      selectedMenu: 0,
      imageWidth: 0,
      imageHeight: 0,
      generalCounter: 0,
      checked: true,
      isLoading: true,
      loadingErrorMessage: null,
      newsList: null,
      newsSelected: 0,
      userDatas: null,
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarStatus: 'info',
    };

    this.butnCoord = [
    // "news" button values
      {
        x : 385,
        y : 195,
        icon : function(){ return <InfoIcon/>}
      },
    // "socialGame" button values
      {
        x : 215,
        y : 305,
        icon : function(){ return <GroupIcon/>}
      },
    // "game" button values
      {
        x : 560,
        y : 300,
        icon : function(){ return <SportsEsportsIcon/>}
      },
    ]

    this.handleClick = this.handleClick.bind(this);
    this.checkUser = this.checkUser.bind(this)
  }

  // Clicking button consequence
  async handleClick (newValue) {
    if (this.state.selectedMenu !== newValue && (newValue === 0 || newValue === 1 || newValue === 2)) {
      this.setState({
        checked: false,
      });

      if (newValue === 0) {
        /*try {
        // Load async data.
        let userData = await API.post(window.location.href, {
          'getNews'
        });

        console.log(userData);

        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
        }*/
      }

      setTimeout ( () => {
        this.setState({
          checked: true,
          selectedMenu: newValue,
        });
      },300)
    }
  }

  snackbarHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      snackbarOpen: false,
    });
  }

  checkUser = (status, message, validFunction) => {
    if (this.state.userDatas && this.state.userDatas.connected) {
      if (validFunction && typeof validFunction === 'function') {  
        validFunction();
      }
    } else {  
      if (!status || !message) {
        this.setState({
          snackbarOpen: true,
          snackbarStatus: 'error',
          snackbarMessage: 'une erreur s\'est produite',
        }); 
      } else {
        this.setState({
          snackbarOpen: true,
          snackbarStatus: status,
          snackbarMessage: message,
        });
      }
    }
  }

  // A counter incremented in the time used in sinusoïdal way to make button fade
  generalCounterIncrementation () {
    setInterval( () => {
      this.setState({
        generalCounter: this.state.generalCounter+1,
      });
    }, 100);
  }

  // Here are tracked width and height of the city image, used to set button positions
  updateDimensions = () => {
    this.setState({
      imageWidth: document.getElementById('town').width,
      imageHeight: document.getElementById('town').height,
    });
  };

  displayButns () {
    let butns = this.butnCoord.map(
      function(butn, index) {
        return (
          <ImageButn
            butn={butn}
            key={index}
            index={index}
            selectedMenu={this.state.selectedMenu}
            generalCounter={this.state.generalCounter}
            imageWidth={this.state.imageWidth}
            imageHeight={this.state.imageHeight}
            handleClick={this.handleClick}
          />
        )
      }, this
    )
    return butns
  }

  async componentDidMount() {
    this.generalCounterIncrementation();
    window.addEventListener('load', this.updateDimensions);
    window.addEventListener('resize', this.updateDimensions);

    // Fetch data to populate news
    try {
      // Load async data.
      let newsList = await API.post('/', {request:'getNews'});

      // Update state with new data and re-render our component.
      newsList = newsList.data;

      this.setState({
        ...this.state, ...{
          isLoading: false,
          newsList
        }
      });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
      this.setState({
        loadingErrorMessage: `😱 Axios request getNews failed: ${e}`,
      });
    }

    // Fetch data to populate user's values
    try {
      // Load async data.
      let userDatas = await API.post('/', {request:'getUser'});

      // Update state with new data and re-render our component.
      userDatas = userDatas.data;

      this.setState({
        ...this.state, ...{
          userDatas
        }
      });
    } catch (e) {
      console.log(`😱 Axios request getUser failed: ${e}`);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    
    return (
      <React.Fragment>
        <div className="App">
          <Navbar
            checkUser={this.checkUser}
            userDatas={this.state.userDatas}
          />
          <Grid container id="mainContainer">
            <Grid item xs={12} md={6} style={{maxWidth:'710px'}}>
              <img src="/images/backgrounds/town.gif" id="town" alt="animated isometric city"/>
              {this.butnCoord && 
                this.displayButns()
              }
            </Grid>
            <Grid item xs={12} md={6}>
              <BlockSection
                userDatas={this.state.userDatas}
                checkUser={this.checkUser}
                className='ScalableHeight'
                style={{minHeight:"325px"}}
                checked={this.state.checked}
                selectedMenu={this.state.selectedMenu}
                imageHeight={this.state.imageHeight}
                newsList={this.state.newsList}
                newsSelected={this.state.newsSelected}
                isLoading={this.state.isLoading}
                loadingErrorMessage={this.state.loadingErrorMessage}
              />
            </Grid>
          </Grid>
        <div className="footerSavior"></div>
        <Footer/>
        </div>
        <Snackbar
          handleClose={this.snackbarHandleClose}
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          status={this.state.snackbarStatus}
        />
      </React.Fragment>
    );
  }
}