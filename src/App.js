import React from 'react';
import Navbar from './components/navbar';
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

    this.handleClick = this.handleClick.bind(this);
  }

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

  generalCounterIncrementation () {
    setInterval( () => {
      this.setState({
        generalCounter: this.state.generalCounter+1,
      });
    }, 100);
  }

  updateDimensions = () => {
    this.setState({
      imageWidth: document.getElementById('town').width,
      imageHeight: document.getElementById('town').height,
    });
  };
  componentDidMount() {
    this.generalCounterIncrementation();
    setTimeout(this.updateDimensions, 1);
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    
    return (
      <div className="App">
        <Navbar />
        <Grid container>
          <Grid item xs={12} md>
            <img src="/images/backgrounds/town.gif" id="town" alt="animated isometric city"/>
            <div className="font-icon-wrapper" onClick={(e) => this.handleClick(0)} value={0}>
              <Fab 
                size="small"
                color="secondary"
                aria-label="add"
                style={{position:'absolute', left: this.state.imageWidth*385/710+'px', top:this.state.imageHeight*195/400+'px', opacity:(Math.abs(Math.sin(this.state.generalCounter / 10))+1)/2}}
              >
              <InfoIcon/>
              </Fab>
            </div>
            <div className="font-icon-wrapper" onClick={(e) => this.handleClick(1)} value={0}>
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                style={{position:'absolute', left:this.state.imageWidth*215/710+'px', top:this.state.imageHeight*305/400+'px', opacity:(Math.abs(Math.sin(this.state.generalCounter / 10))+1)/2}}
              >
                <GroupIcon />
              </Fab>
            </div>
            <div className="font-icon-wrapper" onClick={(e) => this.handleClick(2)} value={0}>
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                style={{position:'absolute', left:this.state.imageWidth*560/710+'px', top:this.state.imageHeight*300/400+'px', opacity:(Math.abs(Math.sin(this.state.generalCounter / 10))+1)/2}}
              >
                <SportsEsportsIcon />
              </Fab>
            </div>
          </Grid>
          <Grid item xs={12} md>
            <BlockSection
              checked={this.state.checked}
              selectedMenu={this.state.selectedMenu}
              imageHeight={this.state.imageHeight}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}