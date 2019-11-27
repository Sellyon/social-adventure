import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid, Typography, Button, Slide, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core/';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import API from './api';

class SocialRPG extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingUserComponent: true,
      openMainMenu: false,
      openBoutique: false,
      loadRequest: false,
    };
    this.handleOpenMainMenu=this.handleOpenMainMenu.bind(this);
    this.handleCloseMainMenu=this.handleCloseMainMenu.bind(this);
    this.handleOpenBoutique=this.handleOpenBoutique.bind(this);
    this.handleCloseBoutique=this.handleCloseBoutique.bind(this);
    this.buyPotion=this.buyPotion.bind(this);
  }

  componentDidMount() {
    let that=this;
    setTimeout(function(){
      that.setState({
        loadingUserComponent: false,
      });
    }, 300);
  }

  handleOpenMainMenu() {
    this.setState({
      openMainMenu: true,
    });
  }

  handleCloseMainMenu() {
    this.setState({
      openMainMenu: false,
    });
  }

  handleOpenBoutique() {
    this.setState({
      openBoutique: true,
    });
  }

  handleCloseBoutique() {
    this.setState({
      openBoutique: false,
    });
  }

  async buyPotion() {
    let that=this;
    if (this.props.userDatas && this.props.userDatas.gold >= 500) {
      if (!this.state.loadRequest) {
        this.setState({
          loadRequest: true
        }, async () => {
          // Fetch data to update news
          try {
            // Load async data.
            let updatedNews = await API.post('/', {request:'buyLevelUpPotion'});

            console.log(updatedNews);

            const message = 'Vous avez acheté une potion de renforcement ! Vous perdez 500 pièces d\'or et gagnez 1 niveau : Vous êtes désormais niveau '+(that.props.userDatas.level+1)+ '😻 il vous reste '+(that.props.userDatas.gold-500)+' pièces d\'or'

            that.props.setOpenSnack('success', message)
          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
            this.setState({
              loadingErrorMessage: `😱 Axios request buy level up potion failed: ${e}`,
              loadRequest: false
            });
          }
        });
      }
    } else {
      this.props.setOpenSnack('error', 'Vous n\'êtes pas assez riche pour acheter cette potion ; votre bourse contient '+this.props.userDatas.gold+' pièces d\'or seulement 😿')
    }
  }

  render() {
    /*const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="down" ref={ref} {...props} />;
    });*/

    const { loadingErrorMessage, userDatas } = this.props;

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

    const socialRPGContent = (
      <div>
        <Typography variant="p" component="p">
          Bonjour {this.props.userDatas && this.props.userDatas.profil} (niveau {this.props.userDatas && this.props.userDatas.level}) ! 😺
        </Typography>
        <Typography variant="p" component="p">
          Vous possédez {this.props.userDatas && this.props.userDatas.gold} pièces d'or
        </Typography>
        <Grid container>
          <Grid item xs>
            <Typography variant="p" component="p">
              Avancer dans votre progression : 
            </Typography>
          </Grid>
          <Grid item xs>
            <Button title="Jouer à Social RPG" onClick={this.handleOpenMainMenu}>
              <VideogameAssetIcon style={{height:'48px', width:'48px', color:'#9B49FF'}}/>
            </Button>
          </Grid>
        </Grid>
      </div>
    )

    const mainMenu = (
      <Dialog
        open={this.state.openMainMenu}
        keepMounted
        onClose={this.handleCloseMainMenu}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Social RPG</DialogTitle>
        <DialogContent>
          On dirait que seule la boutique est ouverte ces temps-ci...
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleOpenBoutique} color="primary">
            Boutique
          </Button>
          <Button onClick={this.handleCloseMainMenu} color="primary" disabled>
            Donjons
          </Button>
          <Button onClick={this.handleCloseMainMenu} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    )

    const boutique = (
      <Dialog
        open={this.state.openBoutique}
        keepMounted
        onClose={this.handleCloseBoutique}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">La boutique</DialogTitle>
        <DialogContent>
          Voyons voir les articles en vente :
        </DialogContent>
        <Grid container style={{ paddingLeft:'20px' }}>
          <Grid item xs>
            <Typography variant="p" component="p">
              Une potion de renforcement (+1 niveau) pour 500 pièces d'or
            </Typography>
          </Grid>
          <Grid item xs>
            <Button title="Acheter cet objet" onClick={this.buyPotion}>
              <ShoppingCartIcon style={{height:'24px', width:'24px', color:'#9B49FF'}}/>
            </Button>
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={this.handleCloseBoutique} color="primary">
            Quitter la boutique
          </Button>
        </DialogActions>
      </Dialog>
    )

    const notConnected =(
      <div>Vous ne pouvez pas jouer à Social RPG si vous n'êtes pas connecté ! <span role="img" aria-label="img">🙀</span></div>
    )

    return (
      <div>
        <Grid container>
          <Grid item xs>
            {
              this.state.loadingUserComponent ? loadingMessage : 
              loadingErrorMessage !== null ? errorMessage :
              userDatas && userDatas.gold && userDatas.level ? socialRPGContent :
              notConnected
            }
          </Grid>
        </Grid>
        {this.state.openMainMenu && mainMenu}
        {this.state.openBoutique && boutique}
      </div>
    );
  }
}

export default SocialRPG;