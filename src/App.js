import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import BlockSection from './components/blockSection';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
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
    };

    this.butnCoord = [
    // "news" button values
      {
        x : 385,
        y : 195,
        icon : function(){ return <InfoIcon/>}
      },
    // "game" button values
      {
        x : 560,
        y : 300,
        icon : function(){ return <SportsEsportsIcon/>}
      },
    // "socialGame" button values
      {
        x : 215,
        y : 305,
        icon : function(){ return <GroupIcon/>}
      },
    ]

    // Natural width & height of the city image, setted in componentDidMount
    this.naturalImageSize = {};

    this.handleClick = this.handleClick.bind(this);
  }

  // Clicking button consequence
  handleClick (newValue) {
    if (this.state.selectedMenu !== newValue && (newValue === 0 || newValue === 1 || newValue === 2)) {
      this.setState({
        checked: false,
      });

      setTimeout ( () => {
        this.setState({
          checked: true,
          selectedMenu: newValue,
        });
      },300)
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

  getPosRelativeToImage (coord, imageSize) {
    return coord/imageSize+'px'
  }

  // Here we set color and opacity of button : opacity to 1 is selected menu is linked to this button and a slightly saturated color
  bgColorButnValue (index) {
    if (index !== this.state.selectedMenu) {
      return 'rgba(194, 18, 26, '+(Math.abs(Math.sin(this.state.generalCounter / 10))+1)/2+')'
    } else {
      return 'rgba(255, 11, 22, '+1+')'
    }
  }

  componentDidMount() {
    this.naturalImageSize = {width:document.getElementById('town').naturalWidth,height:document.getElementById('town').naturalHeight}
    this.generalCounterIncrementation();
    window.addEventListener('load', this.updateDimensions);
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    
    return (
      <React.Fragment>
        <div className="App">
          <Navbar />
          <Grid container>
            <Grid item xs={12} md>
              <img src="/images/backgrounds/town.gif" id="town" alt="animated isometric city"/>
              {this.butnCoord && 
                this.butnCoord.map(
                  function(butn, index) {
                    return (
                      <div className="font-icon-wrapper" onClick={(e) => this.handleClick(index)} value={index} key = {index}>
                        <Fab 
                          size="small"
                          color="secondary"
                          aria-label="add"
                          style={{position:'absolute', left:this.getPosRelativeToImage(this.state.imageWidth*butn.x, this.naturalImageSize.width), top:this.getPosRelativeToImage(this.state.imageHeight*butn.y, this.naturalImageSize.height), width:40, height:40, backgroundColor: this.bgColorButnValue(index),}}
                        >
                        {butn.icon()}
                        </Fab>
                      </div>
                    )
                  }, this
                )
              }
            </Grid>
            <Grid item xs={12} md>
              <BlockSection
                checked={this.state.checked}
                selectedMenu={this.state.selectedMenu}
                imageHeight={this.state.imageHeight}
              />
            </Grid>
          </Grid>
        <div className="footerSavior"></div>
        <Footer/>
        </div>
      </React.Fragment>
    );
  }
}