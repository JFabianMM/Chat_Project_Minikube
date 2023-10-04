import React from 'react'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import MoreIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import { ShowNotifications} from './ShowNotifications';
import { ShowGroupNotifications} from './ShowGroupNotifications';
import {LanguageButton} from './LanguageButton';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage } from '../../redux/slice/pageSlice';
import { setCookie } from '../functions/setCookie';
import { ShowProfileInformation } from './ShowProfileInformation';
import { ShowProfile2 } from './ShowProfile2';
import { updateCurrentRoom } from '../../redux/slice/currentRoomSlice';
import { updateCurrentChat } from '../../redux/slice/currentChatSlice';

export function MenuBar(props) {

    const [open, setOpen] = React.useState(false);
    const [selectedValueGroup, setSelectedValueGroup] = React.useState(false)
    const [selectedValueContact, setSelectedValueContact] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState('1')

    const notifications = useSelector(state => state.notifications);
    const groupNotifications = useSelector(state => state.groupNotifications);
    const userData = useSelector(state => state.userData);
    const rooms = useSelector(state => state.rooms);

    const Dispatch= useDispatch();
    const onClose = () => {
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const showGroupNotifications= (event) => {

        if (!event.target.id){
            setSelectedValue('2');
        }
        setSelectedValue('2');
        setSelectedValueGroup(true)
        
        let ban=0;
        if (selectedValueGroup==true){
            setSelectedValueGroup(false)
            ban=1;  
        }
        if (ban==0){
            Dispatch({type: 'QUERY_GROUP_NOTIFICATION'});
            setSelectedValueGroup(true);
        }
    }
    const showNotifications= (event) => {
        Dispatch({type: 'QUERY_NOTIFICATION'});

        if (!event.target.id){
            setSelectedValue('1');
        }
        setSelectedValue('1');
        setSelectedValueContact(true)
        
        let ban=0;
        if (selectedValueContact==true){
            setSelectedValueContact(false)
            ban=1;  
        }
        if (ban==0){
            setSelectedValueContact(true)
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleMenuCloseLogout = () => {
        let room = userData._id;
        props.socket.emit('leave', room)
        rooms.map((item) =>{
            let room=item.room; 
            props.socket.emit('leave', room);
        });

        Dispatch(updateCurrentChat([]));
        Dispatch(updateCurrentRoom([]));
        setCookie("token", '', -10);
        Dispatch(updatePage('signIn'));
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu anchorEl={anchorEl} anchorOrigin={{vertical: 'top', horizontal: 'right'}} id={menuId} keepMounted transformOrigin={{vertical: 'top',horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            <MenuItem>
              <ShowProfile2 i18n={props.i18n} t={props.t}/>
          </MenuItem> 
          <MenuItem>
              <ShowProfileInformation i18n={props.i18n} t={props.t}/>
          </MenuItem>
            <MenuItem onClick={handleMenuCloseLogout}>{props.t('menu.bar.logout')}</MenuItem>
        </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
      <Menu onClose={handleMobileMenuClose} open={isMobileMenuOpen} anchorEl={mobileMoreAnchorEl} anchorOrigin={{vertical: 'top',horizontal: 'right'}} id={mobileMenuId} keepMounted transformOrigin={{vertical: 'top',horizontal: 'right'}}>
          <MenuItem id={1} onClick={showNotifications}>
              <IconButton id={1}  size="large" aria-label="Contacts" color="inherit">
                  <Badge id={1} badgeContent={notifications} color="error">
                      <PersonIcon id={1}/>
                  </Badge>
              </IconButton>
              <p id={1}>{props.t('menu.bar.contacts')}</p>
              <ShowNotifications i18n={props.i18n} t={props.t} selectedValueContact={selectedValueContact} setSelectedValueContact={setSelectedValueContact} socket={props.socket} setOpen={setOpen} onClose={onClose} selectedValue={selectedValue} open={open}/>
          </MenuItem>
          <MenuItem id={2} onClick={showGroupNotifications}>
              <IconButton id={2}  size="large" aria-label="Groups" color="inherit">
                  <Badge id={2} badgeContent={groupNotifications} color="error">
                    <GroupsIcon id={2}/>
                  </Badge>
              </IconButton>
              <p id={2}>{props.t('menu.bar.groups')}</p>
              <ShowGroupNotifications i18n={props.i18n} t={props.t} selectedValueGroup={selectedValueGroup} setSelectedValueGroup={setSelectedValueGroup} id={2} socket={props.socket} setOpen={setOpen} onClose={onClose} selectedValue={selectedValue} open={open}/>
          </MenuItem>
          <MenuItem id={3} onClick={handleProfileMenuOpen}>
              <IconButton id={3} size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
                  <AccountCircle id={3} />
              </IconButton>
              <p id={3}>{props.t('menu.bar.profile')}</p>
          </MenuItem>
      </Menu>
  );

  return (
      <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{height: '60px'}}>
              <Toolbar>
                  <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      Chat Project
                  </Typography>
                  <Divider style={{paddingLeft:'20px' }} sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <LanguageButton i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet}/>
                  <Box sx={{ flexGrow: 1 }}/>
                  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
    
                      <IconButton id={1} onClick={showNotifications} size="large" aria-label="Contacts" color="inherit">
                          <Badge badgeContent={notifications} color="error">
                              <PersonIcon  />
                          </Badge>
                      </IconButton>
                      <IconButton id={1} onClick={showGroupNotifications} size="large" aria-label="Groups" color="inherit">
                          <Badge badgeContent={groupNotifications} color="error">
                              <GroupsIcon  />
                          </Badge>
                      </IconButton>
                      <IconButton id={3} onClick={handleProfileMenuOpen} aria-controls={menuId} size="large" edge="end" aria-label="account of current user" aria-haspopup="true" color="inherit">
                          <AccountCircle />
                      </IconButton>
                  </Box>
                  <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                      <IconButton onClick={handleMobileMenuOpen} aria-controls={mobileMenuId} size="large" aria-label="show more" aria-haspopup="true" color="inherit">
                          <MoreIcon />
                      </IconButton>
                  </Box>
              </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
      </Box>
  );
}