import React from 'react';
import API from './components/api';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ImageButn from './components/imageButn';
import BlockSection from './components/blockSection';
import Snackbar from './components/snackbar';
import Grid from '@material-ui/core/Grid';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupIcon from '@material-ui/icons/Group';
import './App.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      selectedMenu: 0,
      imageWidth: 0,
      imageHeight: 0,
      generalCounter: 0,
      checked: true,
      isLoading: true,
      loadingUserList:true,
      loadingErrorMessage: null,
      newsList: null,
      newsSelected: 0,
      userDatas: null,
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarStatus: 'info',
      loadRequest: false,
      allPlayerList:[],
      connectedPlayerList:[]
    };

    this.butnCoord = [
    // "news" button values
      {
        x : 385,
        y : 195,
        icon : function(){ return <AnnouncementIcon/>}
      },
    // "socialGame" button values
      {
        x : 385,
        y : 325,
        icon : function(){ return <AccountBalanceIcon/>}
      },
    // "game" button values
      {
        x : 560,
        y : 300,
        icon : function(){ return <SportsEsportsIcon/>}
      },
    // "userList" button values
      {
        x : 215,
        y : 305,
        icon : function(){ return <GroupIcon/>}
      },
    ]

    this.handleClick = this.handleClick.bind(this);
    this.checkUser = this.checkUser.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.deleteNews = this.deleteNews.bind(this)
    this.setOpenSnack = this.setOpenSnack.bind(this)
  }

  // Clicking button consequence
  async handleClick (newValue) {
    if (this.state.selectedMenu !== newValue && (newValue <= this.butnCoord.length)) {
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

  snackbarHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      snackbarOpen: false,
    });
  }

  setOpenSnack = (status, message) => {
    this.setState({
      snackbarOpen: true,
      snackbarStatus: status,
      snackbarMessage: message,
    });
  }

  checkUser = (status, message, validFunction, args) => {
    if (this.state.userDatas && this.state.userDatas.connected) {
      if (validFunction && typeof validFunction === 'function') {  
        validFunction(args);
      } else {
        console.log('Error : function or argument invalid, please check function : ' + validFunction + ' ; or argument : ' + args)
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

  handleLike = (news) => {
    if (!this.state.loadRequest && news) {
      this.setState({
        loadRequest: true
      }, async () => {
        // Fetch data to update news
        try {
          // Load async data.
          let updatedNews = await API.post('/', {request:'likeNews',news:news});
          let newsList = JSON.parse(JSON.stringify(this.state.newsList));

          for (var i = 0; i < newsList.length; i++) {
            if (newsList[i]._id === updatedNews.data._id) {
              newsList[i] = updatedNews.data
            }
          }

          this.setState({
            ...this.state, ...{
              newsList
            },
            loadRequest: false
          });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
          this.setState({
            loadingErrorMessage: `😱 Axios request likeNews failed: ${e} on news ${news}`,
            loadRequest: false
          });
        }
      });
    }
  }

  handleLikeComment = (args) => {
    let news = args.news;
    let comment = args.comment;

    if (!this.state.loadRequest && news) {
      this.setState({
        loadRequest: true
      }, async () => {
        // Fetch data to update news
        try {
          // Load async data.
          let updatedNews = await API.post('/', {request:'likeComment',news:news, comment:comment});
          let newsList = JSON.parse(JSON.stringify(this.state.newsList));

          for (var i = 0; i < newsList.length; i++) {
            if (newsList[i]._id === updatedNews.data._id) {
              newsList[i] = updatedNews.data
            }
          }

          this.setState({
            ...this.state, ...{
              newsList
            },
            loadRequest: false
          });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
          this.setState({
            loadingErrorMessage: `😱 Axios request likeComment failed: ${e} on news ${news}`,
            loadRequest: false
          });
        }
      });
    }
  }

  handleComment = (comment, news, callback) => {
    if (comment.length > 0 && comment.length < 431) {
      if (!this.state.loadRequest && news) {
        this.setState({
          loadRequest: true
        }, async () => {
          // Fetch data to update news with adding comment
          try {
            // Load async data.
            let updatedNews = await API.post('/', {request:'addComment',news:news,comment:comment});
            let newsList = JSON.parse(JSON.stringify(this.state.newsList));

            for (var i = 0; i < newsList.length; i++) {
              if (newsList[i]._id === updatedNews.data._id) {
                newsList[i] = updatedNews.data
              }
            }

            this.setState({
              ...this.state, ...{
                newsList
              },
              loadRequest: false
            }, () => callback());
          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
            this.setState({
              loadingErrorMessage: `😱 Axios request add comment failed: ${e} on news ${news}`,
              loadRequest: false
            }, () => callback());
          }
        });
      }
    } else {
      this.setState({
        snackbarOpen: true,
        snackbarStatus: 'warning',
        snackbarMessage: 'Votre message contient ' + comment.length + ' caractères, il doit contenir entre 1 et 430.',
      });
    }
  }

  deleteComment = (comment, news) => {
    if (!this.state.loadRequest && news && comment) {
      this.setState({
        loadRequest: true
      }, async () => {
        // Fetch data to update news with adding comment
        try {
          // Load async data.
          let updatedNews = await API.post('/', {request:'deleteComment',news:news,comment:comment});
          let newsList = JSON.parse(JSON.stringify(this.state.newsList));

          for (var i = 0; i < newsList.length; i++) {
            if (newsList[i]._id === updatedNews.data._id) {
              newsList[i] = updatedNews.data
            }
          }

          this.setState({
            ...this.state, ...{
              newsList
            },
            loadRequest: false
          }, () => {
            this.setState({
              snackbarOpen: true,
              snackbarStatus: 'success',
              snackbarMessage: 'Votre commentaire a été supprimé.',
            });
          });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
          this.setState({
            loadingErrorMessage: `😱 Axios request delete comment failed: ${e} on news ${news}`,
            loadRequest: false
          });
        }
      });
    }
  }

  deleteNews = (news, callback) => {
    if (!this.state.loadRequest && news) {
      this.setState({
        loadRequest: true
      }, async () => {
        // Fetch data to update news with adding comment
        try {
          // Load async data.
          await API.post('/', {request:'deleteNews',news:news});

          let newsList = JSON.parse(JSON.stringify(this.state.newsList));

          for (var i = 0; i < newsList.length; i++) {
            if (newsList[i]._id === news._id) {
              newsList.splice(i, 1)
            }
          }

          this.setState({
            ...this.state, ...{
              newsList
            },
            loadRequest: false
          }, () => {
            this.setState({
              snackbarOpen: true,
              snackbarStatus: 'success',
              snackbarMessage: 'Votre actu a été supprimée.',
            });
            callback()
          });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
          this.setState({
            loadingErrorMessage: `😱 Axios request delete news failed: ${e} on news ${news}`,
            loadRequest: false
          }, () => callback());
        }
      });
    }
  }

  deleteUser = (name, callback) => {
    if (!this.state.loadRequest && name) {
      this.setState({
        loadRequest: true
      }, async () => {
        // Fetch data to update news with adding comment
        try {
          // Load async data.
          await API.post('/', {request:'deleteUser',name:name});

          let allPlayerList = JSON.parse(JSON.stringify(this.state.allPlayerList));

          for (var i = 0; i < allPlayerList.length; i++) {
            if (allPlayerList[i].name === name) {
              allPlayerList.splice(i, 1)
            }
          }

          this.setState({
            ...this.state, ...{
              allPlayerList
            },
            loadRequest: false
          }, () => {
            this.setState({
              snackbarOpen: true,
              snackbarStatus: 'success',
              snackbarMessage: 'Le compte de '+name+' a été supprimé.',
            });
            callback()
          });
        } catch (e) {
          console.log(`😱 Axios request failed: ${e}`);
          this.setState({
            loadingErrorMessage: `😱 Axios request delete user failed: ${e} on user ${name}`,
            loadRequest: false
          }, () => callback());
        }
      });
    }
  }

  addNews = (news, callback) => {
    if (news.title.length > 0 && news.title.length < 51 && news.content.length > 0 && news.content.length < 431) {
      if (!this.state.loadRequest && news.title && news.content) {
        this.setState({
          loadRequest: true
        }, async () => {
          // Fetch data to update news with adding comment
          try {
            // Load async data.
            let newNews = await API.post('/', {request:'addNews',news:news});
            let newsList = JSON.parse(JSON.stringify(this.state.newsList));

            newsList.push(newNews.data)

            this.setState({
              ...this.state, ...{
                newsList
              },
              loadRequest: false
            }, () => {
              this.setState({
                snackbarOpen: true,
                snackbarStatus: 'success',
                snackbarMessage: 'Votre actu a été publiée.',
              });
              callback()
            });
          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
            this.setState({
              loadingErrorMessage: `😱 Axios request add news failed: ${e} on news ${news}`,
              loadRequest: false
            }, () => callback());
          }
        });
      }
    } else if (news.title.length === 0 || news.title.length > 50) {
      this.setState({
        snackbarOpen: true,
        snackbarStatus: 'warning',
        snackbarMessage: 'Votre titre contient ' + news.title.length + ' caractères, il doit contenir entre 1 et 50.',
      });
    } else if (news.content.length === 0 || news.content.length > 430) {
      this.setState({
        snackbarOpen: true,
        snackbarStatus: 'warning',
        snackbarMessage: 'Votre message contient ' + news.content.length + ' caractères, il doit contenir entre 1 et 430.',
      });
    }
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

  disconnect = async () => {
    this.setState({
      loadRequest: true
    }, async () => {
      // Fetch data to update news with adding comment
      try {
        // Load async data.
        await API.post('/', {request:'disconnect'});

        this.setState({
          userDatas:null
        });

      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
        this.setState({
          loadingErrorMessage: `😱 Axios request disconnect failed: ${e}`,
          loadRequest: false
        });
      }
    });
  }

  async componentDidMount() {
    window.addEventListener('load', this.updateDimensions);
    window.addEventListener('resize', this.updateDimensions);

    let that=this;
    // A counter incremented in the time used in sinusoïdal way to make button fade
    window.generalCounterIncrementation = setInterval( () => {
      that.setState({
        generalCounter: that.state.generalCounter+1,
      });
    }, 100);

    //Activate account
    const url = new URL(window.location);
    if(url.search.length) {
      const searchParams = new URLSearchParams(url.search);
      if(searchParams.has('accountActivation')) {
        console.log('accountActivation')
        let activateAccount = async () => {
          // Fetch data to update news with adding comment
          try {
            // Load async data.
            let response = await API.post('/', {request:'accountActivation',code:searchParams.get('accountActivation')});

            if (response.data === 'account_activated') {
              this.setState({
                snackbarOpen: true,
                snackbarStatus: 'success',
                snackbarMessage: 'Votre compte a été activé avec succès, vous pouvez désormais vous connecter 😺',
              }); 
            } else if (response.data === 'already_activated') {
              this.setState({
                snackbarOpen: true,
                snackbarStatus: 'error',
                snackbarMessage: 'Ce compte a déjà été activé',
              }); 
            } else if (response.data === 'account_unknow') {
              this.setState({
                snackbarOpen: true,
                snackbarStatus: 'error',
                snackbarMessage: 'Il n\'y a pas de compte relié à ce code d\'activation : '+searchParams.get('accountActivation'),
              }); 
            }

          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
            this.setState({
              loadingErrorMessage: `😱 Axios request activate account failed: ${e}`,
              loadRequest: false
            });
          }
        }
        activateAccount()
      }
    }

    // Update events occuring during user's visit
    window.globalInterval = setInterval(async function(){
      try {
        // Load async data.
        let data = await API.post('/', {request:'getNewsAndUsers'});

        // Update state with new data and re-render our component.
        let newsList = data.data.dataNews;
        let allPlayerList = data.data.dataUsers;
        let connectedPlayerList = data.data.connectedPlayerList;

        that.setState({
          ...that.state, ...{
            isLoading: false,
            newsList,
            allPlayerList,
            connectedPlayerList
          }
        });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
        that.setState({
          loadingErrorMessage: `😱 Axios request getNewsAndUsers failed: ${e}`,
        });
      }
    }, 2000);

    // Fetch data to populate user's values
    try {
      // Load async data.
      let userDatas = await API.post('/', {request:'getUser', userDatas:this.state.userDatas});

      // Update state with new data and re-render our component.
      let connectedPlayerList = userDatas.data.connectedPlayerList;

      if (userDatas !== userDatas.data.data && userDatas.data.data.connected) {
        userDatas = userDatas.data.data;
        this.setState({
          snackbarOpen: true,
          snackbarStatus: 'success',
          snackbarMessage: 'Bienvenu sur Social-Adventure ' + userDatas.profil + ' 😺',
        }); 
      }

      this.setState({
        ...this.state, ...{
          loadingUserList: false,
          userDatas,
          connectedPlayerList
        }
      });

      // Update connectedPlayerList when leave page
      let that = this;
      window.onbeforeunload = function (e) {
        if(that.state.userDatas && that.state.userDatas.profil !== null) {
          API.post('/', {request:'disconnection',user:that.state.userDatas.profil});
        }
      };
    } catch (e) {
      console.log(`😱 Axios request getUser failed: ${e}`);
    }
  }
  componentWillUnmount() {
    clearInterval(window.globalInterval);
    clearInterval(window.generalCounterIncrementation);
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <Navbar
            allPlayerList={this.state.allPlayerList}
            LinkToRegister={this.props.LinkToRegister}
            LinkToConnection={this.props.LinkToConnection}
            checkUser={this.checkUser}
            userDatas={this.state.userDatas}
            disconnect={this.disconnect}
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
                setOpenSnack={this.setOpenSnack}
                deleteUser={this.deleteUser}
                loadingUserList={this.state.loadingUserList}
                allPlayerList={this.state.allPlayerList}
                connectedPlayerList={this.state.connectedPlayerList}
                addNews={this.addNews}
                deleteNews={this.deleteNews}
                deleteComment={this.deleteComment}
                handleLike={this.handleLike}
                userDatas={this.state.userDatas}
                checkUser={this.checkUser}
                handleComment={this.handleComment}
                className='ScalableHeight'
                style={{minHeight:"325px"}}
                checked={this.state.checked}
                selectedMenu={this.state.selectedMenu}
                imageHeight={this.state.imageHeight}
                newsList={this.state.newsList}
                newsSelected={this.state.newsSelected}
                isLoading={this.state.isLoading}
                loadingErrorMessage={this.state.loadingErrorMessage}
                loadRequest={this.state.loadRequest}
                handleLikeComment={this.handleLikeComment}
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