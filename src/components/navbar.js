import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Badge, AppBar, Toolbar, IconButton, Typography, MenuItem, Menu, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Button } from '@material-ui/core/';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  AppBar: {
    backgroundColor: 'rgb(155, 73, 255)',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up(320)]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up(320)]: {
      display: 'none',
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openNotifs, setOpenNotifs] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleCloseNotifs = () => {
    setOpenNotifs(false);
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClickProfile = () => {
    window.location.href = "/profil"
  }

  const handleClickRegister = () => {
    window.location.href = "/register"
  }

  const handleClickLogin = () => {
    window.location.href = "/login"
  }

  const handleClickMyAccount = () => {
    /*if (props.allPlayerList && props.userDatas && props.userDatas.profil) {
      for (var i = 0; i < props.allPlayerList.length; i++) {
        if ( props.allPlayerList[i].name === props.userDatas.profil) {
          window.location.href = "/register?playerDatas="+JSON.stringify(props.allPlayerList[i])
        }
      }
    } else {
      console.log('Erreur : tentative interdite d\'accéder à myAccount !')
    }*/
    window.location.href = "/register?getDatas="+props.userDatas.profil
  }

  const openMails = () => {
    console.log(props.userDatas.profil+' veut consulter ses mails')
  }

  const openNotifications = () => {
    setOpenNotifs(true)
  }

  const getMailNumber = () => {
    return 0
  }

  const getNotifNumber = () => {
    if (props.userDatas && props.userDatas.notifNumber) {
      return props.userDatas.notifNumber
    } else {
      return 0
    }
  }

  const getNotifContent = () => {
    if (props.userDatas && props.userDatas.requestYouForFriend && props.userDatas.recommendedFriends) {
      return {requestYouForFriend:props.userDatas.requestYouForFriend, recommendedFriends:props.userDatas.recommendedFriends}
    }
  }

  const  isBadgeInvisible = (type) => {
    if (!props.userDatas || !props.userDatas[type] || props.userDatas[type] === 0) {
      return true
    }
    return false
  }

  const menuId = 'primary-search-account-menu';
  const renderMenuConnected = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleClickProfile}>Mon profil</MenuItem>
      <MenuItem onClick={handleClickMyAccount}>Mon compte</MenuItem>
      <MenuItem onClick={props.disconnect}>Se déconnecter</MenuItem>
    </Menu>
  );
  const renderMenuDisconnected = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleClickRegister}>S'inscrire</MenuItem>
      <MenuItem onClick={handleClickLogin}>Se connecter</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show new mails" color="inherit">
          <Badge badgeContent={getMailNumber()} color="secondary" invisible={isBadgeInvisible('mailNumber')}>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show new notifications" color="inherit">
          <Badge badgeContent={getNotifNumber()} color="secondary" invisible={isBadgeInvisible('notifNumber')}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  let colorIcon = 'default';

  if (props.userDatas && props.userDatas.connected) {
    colorIcon = 'inherit';
  }

  return (
    <>
      <div className={classes.grow}>
        <AppBar position="static" className={classes.AppBar}>
          <Toolbar>
            {props.userDatas && props.userDatas.profil === 'Sellyon' ? (
              <Typography className={classes.title} variant="h6" noWrap>
                Mode super admin <span role="img" aria-label="emoteCat">😺</span>
              </Typography>
              ) : (
              <Typography className={classes.title} variant="h6" noWrap>
                Social-Adventure
              </Typography>
              )}
            <div className={classes.grow} />
            <Typography className={classes.title} variant="h6" noWrap>
              {props.userDatas && props.userDatas.profil}
            </Typography>
            <div className={classes.sectionDesktop}>
              <IconButton
                aria-label="show new mails"
                color={colorIcon}
                onClick={() => props.checkUser('warning', 'Vous devez être connecté pour consulter vos mails.', openMails)}
              >
                  <Badge badgeContent={getMailNumber()} color="secondary" invisible={isBadgeInvisible('mailNumber')}>
                    <MailIcon />
                  </Badge>
              </IconButton>
              <IconButton
                aria-label="show new notifications"
                color={colorIcon}
                onClick={() => props.checkUser('warning', 'Vous devez être connecté pour consulter vos notifications.', openNotifications)}
              >
                <Badge badgeContent={getNotifNumber()} color="secondary" invisible={isBadgeInvisible('notifNumber')}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {(!props.userDatas || !props.userDatas.connected) ? <AccountCircle /> : (<Avatar
                    alt={"Avatar de " + props.userDatas.name}
                    src={props.userDatas.avatar}
                  />)
                }
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {props.userDatas && props.userDatas.connected ? renderMenuConnected : renderMenuDisconnected}
      </div>
      <div>
        <Dialog
          open={openNotifs}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseNotifs}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Vous avez {getNotifNumber()} notifs</DialogTitle>
          <DialogContent>
          {getNotifContent() && getNotifContent().requestYouForFriend && getNotifContent().requestYouForFriend.length > 0 &&
            <Typography className={classes.title} variant="h6" noWrap>
              {getNotifContent().requestYouForFriend.Length} demandes d'amis
            </Typography>}
          {getNotifContent() && getNotifContent().requestYouForFriend && getNotifContent().requestYouForFriend.length > 0 &&
            getNotifContent().requestYouForFriend.map(
              function(request, index) {
                return (
                  <DialogContentText id="alert-dialog-slide-description" key={index}>
                    {request} souhaite vous ajouter en ami.
                  </DialogContentText>
                )
              }
            )
          }
          {getNotifContent() && getNotifContent().recommendedFriends && getNotifContent().recommendedFriends.length > 0 &&
            <Typography className={classes.title} variant="h6" noWrap>
              {getNotifContent().recommendedFriends.Length} recommandations d'amis
            </Typography>}
          {getNotifContent() && getNotifContent().recommendedFriends && getNotifContent().recommendedFriends.length > 0 &&
            getNotifContent().recommendedFriends.map(
              function(recommendation, index) {
                return (
                  <DialogContentText id="alert-dialog-slide-description" key={index}>
                    {recommendation.recommender} vous recommande {recommendation.recommended} en ami
                  </DialogContentText>
                )
              }
            )
          }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickProfile} color="primary">
              Voir mon compte
            </Button>
            <Button onClick={handleCloseNotifs} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}