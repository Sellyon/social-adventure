import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import UserList from './userList';
import { Icon, Grid, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, Card, CardContent, TextField,CardActions, Avatar } from '@material-ui/core/';
import NewsContent from './newsContent';

class UsersSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingUserComponent: true,
    };
    this.getListOfPlayerToShow=this.getListOfPlayerToShow.bind(this);
  }

  componentDidMount() {
    let that=this;
    setTimeout(function(){
      that.setState({
        loadingUserComponent: false,
      });
    }, 300);
  }

  getListOfPlayerToShow(list) {
    let that=this;
    // If user is admin, show all users
    if (this.props.userDatas && this.props.userDatas.profil && this.props.userDatas.profil === 'Sellyon') {
      return list
    } else {
    // If user is not admpin, only show connected users
      let listForBasicUsers = [];
      list.map(function(user, i){
        for (var i = 0; i < that.props.connectedPlayerList.length; i++) {
          if (that.props.connectedPlayerList[i].profil === user.name) {
            listForBasicUsers.push(user)
          }
        } 
      })
      return listForBasicUsers
    }
  }

  render() {
    const { connectedPlayerList, loadingUserList, loadingErrorMessage } = this.props;

    const noUsers = (
      <div>
        <h3>Aucun joueur connecté (à part vous !)</h3>
      </div>
    );

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

    const userListContainer = (
      <>
        <UserList
          loadRequest={this.props.loadRequest}
          allPlayerList={this.props.allPlayerList}
          listOfPlayerToShow={this.getListOfPlayerToShow(this.props.allPlayerList)}
          connectedPlayerList={this.props.connectedPlayerList}
          checkUser={this.props.checkUser}
          userDatas={this.props.userDatas}
          deleteUser={this.props.deleteUser}
        />
      </>
    );

    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs>
            {
              this.state.loadingUserComponent ? loadingMessage : 
              loadingErrorMessage !== null ? errorMessage :
              loadingUserList ? loadingMessage :
              connectedPlayerList && connectedPlayerList.length > 0 ? userListContainer :
              noUsers
            }
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default UsersSection;