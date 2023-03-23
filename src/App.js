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
import '@fontsource/roboto-condensed/300.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import background from './background.jpg';
import './App.css';
import { DataProvider } from './DataContext';
import Box from '@mui/material/Box';

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
  const routeMatch = useRouteMatch(['/schedule', '/schedule/:eventId', '/map', '/questions']);
  const currentTab = routeMatch?.pattern?.path.split('/')[1];;

  return (<BottomNavigation value={currentTab}>
    <BottomNavigationAction component={NavLink} value="schedule" to="/schedule" label="Schedule" icon={<RestoreIcon />} />
    <BottomNavigationAction component={NavLink} value="map" to="/map" label="Map" icon={<LocationOnIcon />} />
    <BottomNavigationAction component={NavLink} value="questions" to="/questions" label="Questions" icon={<ChatBubbleIcon />} />
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

      <Box className="App" sx={{ backgroundImage: `url(${background})` }}>
        <div id="darkener" className="darkener">
          <Container px={2}>
            <DataProvider>
              <Outlet />
            </DataProvider>
          </Container>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Tabs />
          </Paper>
        </div>
      </Box>

    </ThemeProvider>
  );
}

export default App;
