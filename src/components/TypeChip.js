import Chip from '@mui/material/Chip';
import MicIcon from '@mui/icons-material/Mic';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import * as muicolors from '@mui/material/colors';

function typeToColor(type) {
    const types = {
        "talk": "green",
        "keynote": "red",
        "workshop": "blue",
        "panel": "orange",
    };

    return muicolors[types[type]][900];
}

function typeToIcon(type) {
    const types = {
        "talk": <MicIcon />,
        "keynote": <KeyIcon />,
        "workshop": <SettingsIcon />,
        "panel": <PeopleIcon />,
    };

    return types[type];
}

export default function TypeChip({event}) {
    return <Chip icon={typeToIcon(event.type)} label={ event.type } sx={{backgroundColor: typeToColor(event.type), textTransform: 'capitalize'}} />
}