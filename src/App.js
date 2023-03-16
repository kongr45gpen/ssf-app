import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import RestoreIcon from '@mui/icons-material/Restore';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import {
  createMemoryRouter,
  useLocation,
  Route,
  Routes,
  BrowserRouter,
  NavLink,
  matchPath
} from "react-router-dom";
import Schedule from './Schedule';
import Map from './Map';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/material';


const Router = createMemoryRouter([
  {
    path: "/",
    element: <div>Please select a button...</div>,
  }, {
    path: "/schedule",
    element: <div>Schedule</div>,
  }, {
    path: "/map",
    element: <div>Map</div>,
  }
]);

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

function CurrentRoute() {
  const location = useLocation();

  return (
    <Typography variant="body2" sx={{ pb: 2 }} color="text.secondary">
      Current rout!e: {location.pathname}
    </Typography>
  );
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
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Container px={2}>
          <Routes>
            <Route path="/map" element={<Map />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="*" element={<CurrentRoute />} />
          </Routes>
          </Container>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Tabs />
          </Paper>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
