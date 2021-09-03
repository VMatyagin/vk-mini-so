import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  PanelProps,
  Button,
  FixedLayout,
  Separator,
  Div,
  Alert,
  ScreenSpinner,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useRoute } from "react-router5";
import { getAuthorization } from "../../utils/getAuthorization";
import { Voting } from "../../types";
import { NotYetPoll } from "../ui/molecules/NotYetPoll";
import { PausePoll } from "../ui/molecules/PausePoll";
import { EndPoll } from "../ui/molecules/EndPoll";
import { routerStore } from "../../stores/router-store";
import { useMutation } from "react-query";
import { PollAPI } from "../../utils/requests/poll-request";

const connect = (
  pollId: number,
  onMessage: (e: MessageEvent) => void,
  attempt = 1
) => {
  const ws = new WebSocket(
    `ws://localhost:8000/ws/poll/${pollId}/?${getAuthorization()}`
  );
  ws.onmessage = onMessage;

  ws.onclose = (e) => {
    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      e.reason
    );

    attempt < 10 &&
      setTimeout(function () {
        connect(pollId, onMessage, attempt + 1);
      }, 10000);
  };
  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err, "Closing socket");
    ws.close();
  };
  return ws;
};
export const PollViewPanel: FC<PanelProps> = observer((props) => {
  const { route } = useRoute();
  const { openPopout, closePopout } = useContext(routerStore);
  const { pollId } = route.params;
  const [data, setData] = useState<Voting>();
  const [selectedId, selectId] = useState<number>();

  const onMessage = useCallback(
    (e: MessageEvent) => {
      const { message } = JSON.parse(e.data) as {
        message: Voting;
      };
      setData(message);
    },
    [setData]
  );
  useEffect(() => {
    const ws = connect(pollId, onMessage);

    return () => {
      ws.close();
    };
  }, [pollId, onMessage]);

  const currentQuestion = useMemo(
    () => data?.questions.find((question) => question.id === data.question),
    [data?.question, data?.questions]
  );
  const isAnswered = useMemo(
    () =>
      currentQuestion?.answers.reduce(
        (prev, current) => prev || current.answered,
        false
      ),
    [currentQuestion?.answers]
  );
  const { mutate } = useMutation(
    (formData: { answerId: number; pollId: number }) => {
      openPopout(<ScreenSpinner />);
      return PollAPI.vote(formData);
    },
    {
      onSuccess: (data) => {
        setData(data);
        closePopout();
      },
    }
  );
  const confirm = async () => {
    openPopout(
      <Alert
        actions={[
          {
            title: "Подтвердить",
            mode: "destructive",
            autoclose: true,
            action: () => mutate({ pollId: data!.id, answerId: selectedId! }),
          },
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        actionsLayout="horizontal"
        onClose={closePopout}
        header="Подтвердите действие"
        text="Вы уверены, что хотите проголосовать за этот вариант?"
      />
    );
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Голосование
        </Title>
      </PanelHeader>
      {data?.status === 0 && <NotYetPoll />}
      {data?.status === 1 && (
        <Group
          header={<Header mode="primary">{currentQuestion?.text}</Header>}
          style={{ paddingBottom: 60 }}
        >
          {data.question &&
            currentQuestion?.answers?.map((answer) => (
              <Div key={answer.id}>
                <Button
                  disabled={isAnswered}
                  mode={
                    answer.answered || selectedId === answer.id
                      ? "commerce"
                      : "outline"
                  }
                  onClick={() => selectId(answer.id)}
                  size="l"
                  stretched={true}
                >
                  {answer.text}
                </Button>
              </Div>
            ))}

          <FixedLayout filled vertical="bottom">
            <Separator wide />
            <Div>
              <Button
                disabled={isAnswered}
                size="l"
                stretched={true}
                onClick={confirm}
              >
                Подтвердить
              </Button>
            </Div>
          </FixedLayout>
        </Group>
      )}
      {data?.status === 2 && <PausePoll />}
      {data?.status === 3 && <EndPoll />}
    </Panel>
  );
});
