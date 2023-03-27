import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation, useMatches, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Breadcrumbs, InputBase, alpha, styled, useMediaQuery, useTheme } from '@mui/material';
import { useData } from '../DataContext';

const breadcrumbNameMap = {
  '/schedule': 'Schedule',
  '/schedule/event': 'Event',
  '/map': 'Map',
  '/booths': 'Booths',
};

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '& > *': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap!important',
    justifyContent: 'flex-end',
  },
}));


function Breadcrumb({ organisation }) {
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const paths = pathnames
    .map((v, index) => `/${pathnames.slice(0, index + 1).join('/')}`)
    .filter((v) => Object.keys(breadcrumbNameMap).includes(v));

  return (
    <StyledBreadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        <Typography variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {organisation && (mediaQuery ? organisation.event_name : organisation.event_short_name) }
        </Typography>
      </LinkRouter>
      { 
        paths.map((to, index) => {
          let last = index === paths.length - 1;
          return last ? (
            <Typography color="text.primary" key={to}>
              {breadcrumbNameMap[to]}
            </Typography>
          ) : (
            <LinkRouter underline="hover" color="inherit" to={to} key={to}>
              {breadcrumbNameMap[to]}
            </LinkRouter>
          );
        })
      }
    </StyledBreadcrumbs>
  );
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('xs')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      width: '0ch',
      '&:focus': {
        width: '20ch',
      },
    },
    [theme.breakpoints.up('md')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function MainAppBar() {
  const { organisation } = useData();
  const navigate = useNavigate();
  const location = useMatches();

  const [backEnabled, setBackEnabled] = useState(false);

  useEffect(() => {
    setBackEnabled(location && location[1] && location[1].handle && location[1].handle.back);
  }, [location]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="back"
          sx={{ mr: 2, opacity: backEnabled ? 1 : 0 }}
          onClick={() => navigate(-1)}
          disabled={!backEnabled}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}>
          <Breadcrumb organisation={ organisation } />
        </Box>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </Toolbar>
    </AppBar>
  );
}