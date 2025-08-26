import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light", // บังคับเป็น Light Theme
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        text: {
            primary: "#333333",
            secondary: "#555555",
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-root": {
                        height: 40,
                    },
                    "& .MuiInputBase-input": {
                        height: "100%",
                        padding: "0 14px",
                        display: "flex",
                        alignItems: "center",
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 14px"
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                outlined: {
                    top: -8,
                },
            },
        },
    },
});

export default theme;
