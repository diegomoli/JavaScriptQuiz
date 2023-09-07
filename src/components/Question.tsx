import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { type Question as QuestionType } from "../types/types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gradientDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useQuestionsStore } from "../store/question";

const getBackgroundColor = (info: QuestionType, index: number) => {
  const { userSelectedAnswer, correctAnswer } = info;
  // Usuario no ha seleccionado nada todavía
  if (userSelectedAnswer == null) return "transparent";
  // Si ya selecciono pero la solución es incorrecta
  if (index !== correctAnswer && index !== userSelectedAnswer)
    return "transparent";
  // Si es la solución correcta
  if (index === correctAnswer) return "green";
  // Si es la selección del usuario pero no es correcta
  if (index === userSelectedAnswer) return "red";
  // Si no es ninguna de las anteriores
  return "transparent";
};

export const Question = ({ info }: { info: QuestionType }) => {
  const selectAnswer = useQuestionsStore((state) => state.selectAnswer);
  const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion);

  const handleClick = (answerIndex: number) => () => {
    selectAnswer(info.id, answerIndex);
    setTimeout(() => {
      goNextQuestion();
    }, 1500);
  };

  return (
    <Card
      variant="outlined"
      sx={{ bgcolor: "#222", p: 2, textAlign: "left", marginTop: 4 }}
    >
      <Typography variant="h5">{info.question}</Typography>
      <SyntaxHighlighter language="javascript" style={gradientDark}>
        {info.code}
      </SyntaxHighlighter>
      <List sx={{ bgcolor: "#333" }} disablePadding>
        {info.answers.map((answer, index) => (
          <ListItem key={index} disablePadding divider>
            <ListItemButton
              disabled={info.userSelectedAnswer != null}
              onClick={handleClick(index)}
              sx={{
                backgroundColor: getBackgroundColor(info, index),
              }}
            >
              <ListItemText primary={answer} sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
