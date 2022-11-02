import React, { useState, useEffect } from "react";
import { Menu, MenuItem } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from "react-router-dom";

//Icon---------------------------------------------------------------------------------
import HomeIcon from "@mui/icons-material/Home";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";


//ระบบลงทะเบียนข้อมูลนักศึกษา---------------------------------------------------------------
import StudentCreate from "./StudentCreate";
import Student from "./Student";
import Home from "./HomeUser";

//ระบบลงทะเบียนขอทุนการศึกษา---------------------------------------------------------------
import ReportCreate from "./ReportCreate";
import Report from "./Report";

import { GetStudentByUID } from "../services/HttpClientServiceUser";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const menu = [
  { name: "หน้าหลัก", icon: <HomeIcon />, path: "/" },
  { name: "ลงทะเบียนข้อมูล", icon: <AssignmentIndIcon />, path: "/StudentCreate" },
  { name: "ลงทะเบียนขอทุน", icon: <RequestQuoteIcon />, path: "/ReportCreate" },

];

function AppBarStudent() {

  const [anchorProFile, setAnchorProFile] = useState<null | HTMLElement>(null)
  const openProFile = Boolean(anchorProFile)
  const handleClinkProFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorProFile(event.currentTarget)

  }
  const handleCloseProFile = () => {
    setAnchorProFile(null)
  }

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const signout = () => {
    setAnchorProFile(null)
    localStorage.clear();
    window.location.href = "/";
  };

  const getStudentByUid = async () => {
    let res = await GetStudentByUID();   
    if (res) {
      localStorage.setItem("sid", res.ID)
    }
  };

  useEffect(() => {
    getStudentByUid();
  }, []);




  return (
    <Router>
      <ThemeProvider theme={mdTheme} >
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" color="secondary" open={open}>
            <Toolbar
              sx={{
                pr: "24px",
                // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                ระบบทุนการศึกษา
              </Typography>

              <IconButton
                size='large'
                edge='start'
                color='inherit'
                id='resources-button-profile'
                onClick={handleClinkProFile}
                aria-controls={openProFile ? 'resources-profile' : undefined}
                aria-haspopup='true'
                aria-expanded={openProFile ? 'true' : undefined}
              >
                <AccountCircle sx={{ fontSize: 40 }} />

              </IconButton>

              <Menu
                id='resources-profile'
                anchorEl={anchorProFile}
                open={openProFile}
                MenuListProps={{
                  'aria-labelledby': 'resources-button-profile',
                }}
                onClose={handleCloseProFile}
              >
                <MenuItem onClick={handleCloseProFile} component={RouterLink} to="/ProFile">ประวัติ</MenuItem>
                <MenuItem onClick={handleCloseProFile} component={RouterLink} to="/History">ประวัติขอทุน</MenuItem>
                <MenuItem onClick={signout} >ออกจากระบบ</MenuItem>

              </Menu>


              {/* <Button color="inherit" onClick={signout}>
                ออกจากระบบ
              </Button> */}
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>
              {menu.map((item, index) => (
                <Link
                  to={item.path}
                  key={item.name}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem button>
                    <ListItemIcon sx={{ color: '#9c27b0' }} >{item.icon}</ListItemIcon>
                    <ListItemText sx={{ color: '#9c27b0' }} primary={item.name} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/StudentCreate" element={<StudentCreate />} />
                <Route path="/ProFile" element={<Student />} />
                <Route path="/ReportCreate" element={<ReportCreate />} />
                <Route path="/History" element={<Report />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default AppBarStudent