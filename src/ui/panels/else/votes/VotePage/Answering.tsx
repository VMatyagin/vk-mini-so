import {
  Alert,
  Group,
  Div,
  Title,
  Button,
  InfoRow,
  Progress,
} from "@vkontakte/vkui";
import React, { FC } from "react";
import { useMst } from "../../../../../feature/stores";
import { strapi } from "../../../../../feature/utils/api.service";

interface QuestionProps {
  isVoted: number;
  isSelected: boolean;
  onClick: () => void;
  answer: string;
}

const Question: FC<QuestionProps> = ({
  isVoted,
  isSelected,
  onClick,
  answer,
}) => (
  <Div>
    <Button
      mode={isSelected ? "primary" : "outline"}
      size="xl"
      key={answer}
      disabled={isVoted ? true : false}
      onClick={onClick}
    >
      {answer}
    </Button>
  </Div>
);

const Popup: FC<{ handleOk: () => void; onClose: () => void }> = ({
  handleOk,
  onClose,
}) => (
  <Alert
    actions={[
      {
        title: "Отмена",
        autoclose: true,
        mode: "cancel",
      },
      {
        title: "ОК",
        autoclose: true,
        mode: "default",
        action: () => handleOk(),
      },
    ]}
    onClose={onClose}
  >
    <h2>Подтвердите действие</h2>
  </Alert>
);

export const Answering = () => {
  const store = useMst();
  const { questions } = store.voteData;
  const currentQuestion = questions[store.voteData.vote.currentQuestion];

  const handleClick = (answerId: number) => {
    const vote = {
      user: store.app.soData.id,
      poll_answer: answerId,
      poll_question: currentQuestion.id,
      poll: store.voteData.vote.id,
    };
    store.router.openPopout(
      <Popup
        handleOk={() => strapi.sendVote(vote)}
        onClose={store.router.closePopout}
      />
    );
  };

  return (
    <>
      <Group>
        <Div>
          <InfoRow
            header={`Отвечено на ${store.voteData.vote.currentQuestion} из ${questions.length}`}
          >
            <Progress
              value={
                (store.voteData.vote.currentQuestion * 100) / questions.length
              }
            />
          </InfoRow>
        </Div>
        {questions.length > 0 && (
          <>
            <Group>
              <Div>
                <Title level="2" weight="bold">
                  {currentQuestion.title}
                </Title>
              </Div>
            </Group>
            <Group>
              {currentQuestion.poll_answers.map((item) => {
                const isVoted = store.voteData.currentIsVoted();
                return (
                  <Question
                    answer={item.answer}
                    onClick={() => handleClick(item.id)}
                    isVoted={isVoted}
                    isSelected={isVoted === item.id}
                  />
                );
              })}
            </Group>
          </>
        )}
      </Group>
    </>
  );
};
