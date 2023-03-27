import React, { useEffect } from 'react';
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
import Schedule from './components/Schedule';
import Map from './components/Map';
import Event, { loader as eventLoader } from './components/Event';
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
import { BackgroundProvider, ReactiveBackground } from './components/ReactiveBackground';
import Error404 from './components/Error404';
import MainAppBar from './components/MainAppBar';
import FestivalIcon from '@mui/icons-material/Festival';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Booths from './components/Booths';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
        path: "/schedule/:filter",
        element: <Schedule />,
      }, {
        path: "/schedule/event/:eventId",
        element: <Event />,
        handle: {
          back: true
        }
      }, {
        path: "/map",
        element: <Map />
      }, {
        path: "/booths",
        element: <Booths />
      }, {
        path: "*",
        element: <Error404 />
      }],
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
  const routeMatch = useRouteMatch(['/schedule', '/schedule/:filter', '/schedule/event/:eventId', '/activities', '/booths', '/map', '/questions']);
  const currentTab = routeMatch?.pattern?.path.split('/')[1];;

  return (<BottomNavigation value={currentTab}>
    <BottomNavigationAction component={NavLink} value="schedule" to="/schedule" label="Talks" icon={<RestoreIcon />} />
    <BottomNavigationAction component={NavLink} value="activities" to="/activities" label="Activities" icon={<SportsEsportsIcon />} />
    <BottomNavigationAction component={NavLink} value="booths" to="/booths" label="Booths" icon={<FestivalIcon />} />
    <BottomNavigationAction component={NavLink} value="map" to="/map" label="Map" icon={<LocationOnIcon />} />
    <BottomNavigationAction component={NavLink} value="questions" to="/questions" label="Q&amp;A" icon={<ChatBubbleIcon />} />
  </BottomNavigation>);
}

function App() {
  return (
    <RouterProvider router={router} />
  );
}

function Root() {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box className="App">
        <DataProvider>
          <MainAppBar />
          <Container px={2}>
            <BackgroundProvider>
              <ReactiveBackground />
              <Outlet />
            </BackgroundProvider>
          </Container>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Tabs />
          </Paper>
        </DataProvider>
      </Box>

    </ThemeProvider>
  );
}

export default App;
