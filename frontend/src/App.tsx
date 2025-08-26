import "./App.css";
import {
    Box,
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
    Theme,
} from "@chakra-ui/react";
import MainPage from "./pages/MainPage/MainPage";
import { ColorModeProvider } from "./components/ui/color-mode";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
    const config = defineConfig({
        theme: {
            tokens: {
                colors: {
                    primary: { value: "#FFFFFF" },
                    secondary: { value: "#EE0F0F" },
                },
                fonts: {
                    body: { value: "system-ui, sans-serif" },
                },
            },
        },
    });

    const system = createSystem(defaultConfig, config);

    return (
        <ColorModeProvider forcedTheme="light">
            <ThemeProvider theme={theme}>
                <Theme appearance="light">
                    <Box
                        width={"100vw"}
                        height={"100vh"}
                        minWidth={1000}
                        overflow={"auto"}
                        bgColor={"#ffffff"}
                    >
                        <ChakraProvider value={system}>
                            <MainPage />
                        </ChakraProvider>
                    </Box>
                </Theme>
            </ThemeProvider>
        </ColorModeProvider>
    );
}

export default App;
