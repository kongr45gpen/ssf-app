import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import RestoreIcon from '@mui/icons-material/Restore';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import {
  createBrowserRouter,
  useLocation,
  RouterProvider,
  NavLink,
  matchPath,
  Outlet,
  Redirect,
  redirect
} from "react-router-dom";
import Schedule from './Schedule';
import Map from './Map';
import Event, { loader as eventLoader } from './Event';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import background from './background.jpg';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function CurrentRoute() {
  const location = useLocation();

  return (
    <Typography variant="body2" sx={{ pb: 2 }} color="text.secondary">
      Current route: {location.pathname}
    </Typography>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        loader: () => redirect("/schedule"),
      },
      {
        path: "/schedule",
        element: <Schedule />,
      }, {
        path: "/schedule/:eventId",
        element: <Event />,
        loader: eventLoader,
      }, {
        path: "/map",
        element: <Map />
      }, {
        path: "*",
        element: <CurrentRoute />
      }]
  }
], {
  // basename: "/ssf-app/build",
});

function useRouteMatch(patterns) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}

function Tabs() {
  const routeMatch = useRouteMatch(['/schedule', '/map', '/questions']);
  const currentTab = routeMatch?.pattern?.path;

  return (<BottomNavigation value={currentTab}>
    <BottomNavigationAction component={NavLink} value="/schedule" to="/schedule" label="Schedule" icon={<RestoreIcon />} />
    <BottomNavigationAction component={NavLink} value="/map" to="/map" label="Map" icon={<LocationOnIcon />} />
    <BottomNavigationAction component={NavLink} value="/questions" to="/questions" label="Questions" icon={<ChatBubbleIcon />} />
  </BottomNavigation>);
}

function App() {
  return (
    <RouterProvider router={router} />
  );
}

function Root() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App" style={{ backgroundImage: `url(${background})` }}>
        <header className="App-header">
          <Container px={2}>
            <Outlet />
          </Container>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Tabs />
          </Paper>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
