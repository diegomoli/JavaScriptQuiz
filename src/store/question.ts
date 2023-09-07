import { create } from "zustand";
import { type Question } from "../types/types";
import confetti from "canvas-confetti";
import { persist, devtools } from "zustand/middleware";

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

export const useQuestionsStore = create<State>()(
  devtools(
    persist(
      (set, get) => {
        return {
          questions: [],
          currentQuestion: 0,

          fetchQuestions: async (limit: number) => {
            const resp = await fetch("http://127.0.0.1:5173/data.json");
            const json = await resp.json();

            const questions = json
              .sort(() => Math.random() - 0.5)
              .slice(0, limit);
            set({ questions }, false, "FETCHQUIESTIONS");
          },
          selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            //Para clonar todas las preguntas
            const newQuestions = structuredClone(questions);
            //Para encontrar el índice de la pregunta
            const questionIndex = newQuestions.findIndex(
              (q) => q.id === questionId
            );
            //Para actualizar la información
            const questionInfo = newQuestions[questionIndex];
            //Para saber si la respuesta es correcta
            const isCorrectUserAnswer =
              questionInfo.correctAnswer === answerIndex;
            if (isCorrectUserAnswer) confetti();
            //Cambiar la información en la copia de la pregunta
            newQuestions[questionIndex] = {
              ...questionInfo,
              isCorrectUserAnswer,
              userSelectedAnswer: answerIndex,
            };
            //Actualizar el estado
            set({ questions: newQuestions }, false, "SELECTANSWERS");
          },

          goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nextQuestion = currentQuestion + 1;

            if (nextQuestion < questions.length) {
              set({ currentQuestion: nextQuestion }, false, "GONEXTQUESTIONS");
            }
          },
          goPreviousQuestion: () => {
            const { currentQuestion } = get();
            const previousQuestion = currentQuestion - 1;

            if (previousQuestion >= 0) {
              set(
                { currentQuestion: previousQuestion },
                false,
                "GOPREVIOUSQUESTIONS"
              );
            }
          },

          reset: () => {
            set({ currentQuestion: 0, questions: [] }, false, "RESET");
          },
        };
      },
      { name: "questions" }
    )
  )
);
