import { Chip, Paper, Stack, Typography, styled } from "@mui/material"
import { useLocation } from "react-router-dom";
import ErrorIcon from '@mui/icons-material/Error';

export default function Error404() {
    const location = useLocation();

    const StyledTitle = styled('h1')(({ theme }) => ({
        color: theme.palette.secondary.main,
        fontSize: '10rem',
        fontWeight: 700,
        fontFamily: 'Roboto Condensed',
    }));

    return <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" width="100%">
        <StyledTitle>Oops!</StyledTitle>
        <Paper elevation={12} sx={{ p: 5 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <ErrorIcon sx={{ fontSize: 80 }} />
                <Typography>The page <Chip label={location.pathname} /> you are looking for does not exist.</Typography>
            </Stack>
        </Paper>
    </Stack>
}