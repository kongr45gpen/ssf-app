import { Box, styled } from "@mui/material";
import { useEffect, useState, createContext, useContext } from "react";

const ParentBox = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    zIndex: -9,
    pointerEvents: "none",
    backgroundColor: "#000000",
    opacity: 0,
    transition: "all 0.5s ease-in-out",
}));

const ChildBox = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundSize: "cover",
    opacity: 0,
    transition: "all 0.5s ease-in-out",
}));

export const BackgroundContext = createContext(null);

export function BackgroundProvider({ children }) {
    const [background, setBackground] = useState(null);

    return (
        <BackgroundContext.Provider value={{ background, setBackground }}>
            {children}
        </BackgroundContext.Provider>
    );
}

export function ReactiveBackground() {
    const { background } = useContext(BackgroundContext);
    const [img, setImg] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (background) {
            const image = new Image();
            image.onload = () => {
                setLoaded(true);
            }
            setImg(background);
            image.src = background;
        } else {
            setLoaded(false);
        }
    }, [background]);

    return <ParentBox className="background-overlay-parent" sx={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "rotate(30deg) scale(1.4)" }} aria-hidden>
        <ChildBox className="background-overlay-child" sx={{ backgroundImage: `url(${img})`, opacity: loaded ? 0.25 : 0 }} />
    </ParentBox>
}