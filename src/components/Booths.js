import React, { } from 'react';
import { useData } from '../DataContext';
import { styled } from '@mui/material/styles';
import Masonry from '@mui/lab/Masonry';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import { Chip, CircularProgress, Grid, Link, Skeleton, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Moment from 'moment';
import { Image } from 'react-shimmer';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function Booth({ booth }) {
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(false);

    return <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardHeader
            title={booth.name}
        // subheader="September 14, 2016"
        />
        <CardMedia
            aria-hidden={true}
            height="194"
            className="shimmered-image"
        >
            <Image
                alt="Logo"
                src={booth.logo.data.attributes.url}
                fallback={<Skeleton variant="rectangular" height={194} />}
                fadeIn={1}
            />
        </CardMedia>
        <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
            {booth.start && booth.end &&
                <Chip size="small" variant="outlined" label={
                    booth.start == booth.end
                        ? `${Moment(booth.start).format('dddd')}`
                        : `${Moment(booth.start).format('dddd')} – ${Moment(booth.end).format('dddd')}`}
                    color="secondary" />
            }
        </CardContent>
        <CardActions disableSpacing>
            {booth.url && <IconButton href={booth.url} aria-label="visit website" target="_blank" rel="noopener">
                <LinkIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>}
            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
                <ShareIcon />
            </IconButton>
            <ExpandMore
                expand={expanded}
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Typography variant="body2" paragraph={false} sx={{ fontSize: '0.8rem', '& :first-of-type': { marginTop: 0 }, '& :last-of-type': { marginBottom: 0 } }}>
                    <ReactMarkdown>
                        {booth.description}
                    </ReactMarkdown>
                </Typography>
            </CardContent>
        </Collapse>
    </Card>
}

export default function Booths() {
    const { booths } = useData();

    return (
        <div>
            <h2>Booths</h2>
            <Grid container spacing={2} alignItems='stretch'>
                {booths && booths.map((booth) => (
                    <Grid key={booth.id} item xs={12} sm={6} md={4} lg={3}>
                        <Booth booth={booth.attributes} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}