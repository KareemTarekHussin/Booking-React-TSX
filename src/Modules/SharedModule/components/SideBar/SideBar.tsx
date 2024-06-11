import  { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, CircularProgress, Modal, Typography, useMediaQuery } from "@mui/material";
import ChangePass from "../../../AuthenticationModule/components/ChangePass/ChangePass";
import { useToast } from "../../../Context/ToastContext";
import { Link, useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import AppsIcon from '@mui/icons-material/Apps';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useSidebar } from '../../../Context/SidebarContext';
import logoImg from '../../../../assets/Images/Staycation..png'

const SideBar = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [collapsedWidth, setCollapsedWidth] = useState("80px");
  const { toggled, collapsed, setCollapsed, toggleSidebar } = useSidebar();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const isMobile = useMediaQuery('(max-width:576px)');

  const handleMenuItemClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };
  
  
  // const updateCollapsedWidth = () => {
  //   const width = window.innerWidth;
  //   if (width <= 576) {
  //     setCollapsedWidth("60px");
  //   } else {
  //     setCollapsedWidth("80px");
  //   }
  // };

  // useEffect(() => {
  //   updateCollapsedWidth();
  //   window.addEventListener('resize', updateCollapsedWidth);
  //   return () => window.removeEventListener('resize', updateCollapsedWidth);
  // }, []);

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
      showToast("success", 'Logged out successfully');
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            px: 3,
            py: 5,
            borderRadius: 2,
          }}
        >
          <ChangePass />
        </Box>
      </Modal>

      <div className="sidebar-container">
        <Sidebar 
          collapsed={collapsed} 
          collapsedWidth={collapsedWidth}
          toggled={toggled}
          breakPoint="sm"
          onBackdropClick={toggleSidebar}
        >
          <Menu style={{ backgroundColor: "orang", marginTop: 50 }}>
            
            <Box sx={{display:{xs:'none',sm:'block'}}}>
              <MenuItem
                onClick={handleCollapse}
                style={{ textAlign: "center", marginBottom: 15 }}
              >
                <button
                  className={`collapse-button ${collapsed ? "" : "expanded"}`}
                >
                  <ArrowForwardIcon
                    sx={{ marginTop: 1, marginRight: { xs: 2, sm: 0 } }}
                  />
                </button>
              </MenuItem>
            </Box>

            <Box sx={{display:{sm:'none'},backgroundColor:'gree'}}>
              
              <MenuItem 
                component={<Link to="" />}
                onClick={handleMenuItemClick}
                style={{ backgroundColor:'orang',marginBottom:'15px'}}
                >
                <Typography  sx={{ fontSize:{xs:22},fontWeight:600 ,display: 'inline',color:'#fff' }}>
                  Stay
                </Typography>
                <Typography  sx={{ fontSize:{xs:22},fontWeight:600 ,display: 'inline',color:'#fff' }}>
                  cation.
                </Typography>
              </MenuItem>

            </Box>

            <MenuItem
              onClick={handleMenuItemClick}
              component={<Link to="" />}
              icon={
                <HomeIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Home</button>
            </MenuItem>

            <MenuItem
              onClick={handleMenuItemClick}
              component={<Link to="users" />}
              icon={
                <GroupIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Users</button>
            </MenuItem>

            <MenuItem
              onClick={handleMenuItemClick}
              component={<Link to="rooms" />}
              icon={
                <MeetingRoomIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Rooms</button>
            </MenuItem>

            <MenuItem
              onClick={handleMenuItemClick}
              component={<Link to="adslist" />}
              icon={
                <CalendarMonthIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>ADS</button>
            </MenuItem>

            <MenuItem
              onClick={handleMenuItemClick}
              component={<Link to="facilities" />}
              icon={
                <AppsIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Facilities</button>
            </MenuItem>

            <MenuItem
              onClick={handleMenuItemClick}
              component={<Link to="booking" />}
              icon={
                <BookmarkBorderIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Booking</button>
            </MenuItem>

            <MenuItem
              onClick={handleOpen}
              icon={
                <LockOpenIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Change Password</button>
            </MenuItem>

            <MenuItem
              onClick={logout}
              icon={loading ? <CircularProgress size={20} sx={{color:'white'}} /> : < ExitToAppIcon sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}/>}
            >
              <button disabled={loading}>
                Logout
              </button>
            </MenuItem>

          </Menu>
        </Sidebar>
      </div>
    </>
  );
}

export default SideBar;
