import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Badge, AppBar, Toolbar, IconButton, Typography, MenuItem, Menu, Avatar } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
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
  /*title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },*/
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

export default function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

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

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const openMails = () => {
    console.log(props.userDatas.profil+' veut consulter ses mails')
  }

  const openNotifications = () => {
    console.log(props.userDatas.profil+' veut consulter ses notifications')
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
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
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
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
    <div className={classes.grow}>
      <AppBar position="static" className={classes.AppBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon/>
          </IconButton>
          <div className={classes.grow} />
          <Typography className={classes.title} variant="h6" noWrap>
            {props.userDatas && props.userDatas.profil}
          </Typography>
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show 4 new mails"
              color={colorIcon}
              onClick={() => props.checkUser('warning', 'Vous devez être connecté pour consulter vos mails.', openMails)}
            >
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="show 17 new notifications"
              color={colorIcon}
              onClick={() => props.checkUser('warning', 'Vous devez être connecté pour consulter vos notifications.', openNotifications)}
            >
              <Badge badgeContent={17} color="secondary">
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
      {renderMenu}
    </div>
  );
}