import React, { FC, useEffect, useState } from "react";
import {
  PanelHeader,
  Title,
  PanelHeaderBack,
  ScreenSpinner,
  Snackbar,
} from "@vkontakte/vkui";
import { useMst } from "../../../../../feature/stores";
import { PanelTemplate } from "../../../template/PanelTemplate";
import { strapi } from "../../../../../feature/utils/api.service";
import socketIOClient from "socket.io-client";
import { observer } from "mobx-react";
import {
  Poll,
  QuestionResult,
} from "../../../../../feature/stores/vote-store/types";
import { SorryForThat } from "./SorryForThat";
import { Answering } from "./Answering";
import { Awaiting } from "./Awaiting";

export const VotePage: FC<{ id: string }> = observer(({ id }) => {
  const store = useMst();

  const [isLoading, setLoading] = useState(true);
  const [isAnswering, setIsAnswering] = useState(true);
  const [
    currentQuestionResult,
    setCurrentQuestionResult,
  ] = useState<QuestionResult | null>(null);
  const [snackBar, setSnackBar] = useState<React.ReactNode | null>(null);

  const openBase = (text: string) => {
    if (snackBar) return;
    setSnackBar(
      <Snackbar layout="vertical" onClose={() => setSnackBar(null)}>
        {text}
      </Snackbar>
    );
  };
  useEffect(() => {
    let socket: SocketIOClient.Socket | null = null;
    if (store.voteData.vote.isRealTime) {
      store.router.openPopout(<ScreenSpinner />);

      socket = socketIOClient("http://localhost:1337/vote");

      socket.on("connect", () => {
        store.router.closePopout();
        console.log("connected");
        openBase("Подключено");
      });
      socket.emit("join", { id: store.voteData.vote.id });
      socket.on("reconnect", store.router.closePopout);

      socket.on("vote_status_update", (data: Poll) => {
        store.voteData.setVote(data);
        openBase("Данные обновлены");
      });

      socket.on("reconnecting", () => {
        store.router.openPopout(<ScreenSpinner />);
        openBase("Переподключение");
      });
    }

    return () => {
      socket && socket.disconnect();
      socket && console.log("disconnectes");
    };
  }, [store.voteData, store.router]);

  useEffect(() => {
    const getData = async () => {
      const [questions, votes, result] = await Promise.all([
        strapi.getQuestions(store.voteData.vote.id),
        strapi.getVotes(store.voteData.vote.id, store.app.soData.id),
        strapi.getResultsByQuestion(store.voteData.vote.currentQuestion),
      ]);
      store.voteData.setQuestions(questions);
      store.voteData.setSelfVotes(votes);
      setCurrentQuestionResult(result);
      setLoading(false);
    };
    getData();
  }, [store]);

  const handleAnswer = () => {
    setIsAnswering((prev) => !prev);
  };  
  return (
    <PanelTemplate id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={store.router.goBack} />}>
        <Title level="2" weight="bold">
          {store.voteData.vote.title}
        </Title>
      </PanelHeader>
      {!isLoading &&
        store.voteData.vote.isRealTime &&
        store.voteData.vote.disabled && <SorryForThat />}
      {!isLoading &&
        store.voteData.vote.isRealTime &&
        !store.voteData.vote.disabled && (
          <>{isAnswering ? <Answering onEnd={handleAnswer} /> : null}</>
        )}
      {snackBar}
    </PanelTemplate>
  );
});

// удаление голосов по отрядам или штабам из списка. В этом же списке можно проставить вес голоса.Круто если выпадающий списко
// statuses:
