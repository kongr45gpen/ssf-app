import { Box, styled } from "@mui/material";

const ParentBox = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    zIndex: -9,
    pointerEvents: "none",
}));

const ChildBox = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "100%",
    backgroundColor: "red"
}));

export default function ReactiveBackground() {
    return <Box></Box>
    // return <ParentBox><ChildBox /></ParentBox>
}