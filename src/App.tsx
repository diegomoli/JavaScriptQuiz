import "./App.css";
import { Container, Stack, Typography, useTheme } from "@mui/material";
import { JavaScriptLogo } from "./JavaScriptLogo";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuestionsStore } from "./store/question";
import { Start } from "./components/Start";
import { Game } from "./Views/Game";

function App() {
  const questions = useQuestionsStore((state) => state.questions);
  // const { unanswered } = useQuestionsData()
  const theme = useTheme();

  const medium = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <main>
      <Container maxWidth="sm">
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <JavaScriptLogo />
          <Typography variant={medium ? "h2" : "h5"} component="h1">
            JavaScript Quiz
          </Typography>
        </Stack>

        {questions.length === 0 && <Start />}
        {questions.length > 0 && <Game />}
        {/* {questions.length > 0 && unanswered > 0 && <Game />} */}
        {/* {questions.length > 0 && unanswered === 0 && <Results />} */}
      </Container>
    </main>
  );
}

export default App;
