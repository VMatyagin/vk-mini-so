import {
  Alert,
  Group,
  Div,
  Title,
  Button,
  InfoRow,
  Progress,
  CellButton,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { toJS } from "mobx";
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

export const Answering = observer(({ onEnd }: { onEnd: () => void }) => {
  const store = useMst();
  const currentQuestion = toJS(store.voteData.questions).find(
    (item) => item.id === store.voteData.vote.currentQuestion
  );

  const handleOk = async (answerId: number) => {
    try {
      const vote = {
        user: store.app.soData.id,
        poll_answer: answerId,
        poll_question: store.voteData.vote.currentQuestion,
        poll: store.voteData.vote.id,
      };
      await strapi.sendVote(vote);
      onEnd();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (answerId: number) => {
    store.router.openPopout(
      <Popup
        handleOk={() => handleOk(answerId)}
        onClose={store.router.closePopout}
      />
    );
  };
  const vote = store.voteData.selfVotes.find(
    (vote) =>
      typeof vote.poll_question !== "number" &&
      vote.poll_question.id === store.voteData.vote.currentQuestion
  );

  return (
    <>
      {JSON.stringify(store.voteData.selfVotes)}
      <Group>
        {currentQuestion && (
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
                const isVoted = 0;
                return (
                  <Question
                    key={item.id}
                    answer={item.answer}
                    onClick={() => handleClick(item.id)}
                    isVoted={isVoted}
                    isSelected={isVoted === item.id}
                  />
                );
              })}
            </Group>
            {false && (
              <Group>
                <CellButton onClick={onEnd}>К результатам </CellButton>
              </Group>
            )}
          </>
        )}
      </Group>
    </>
  );
});
