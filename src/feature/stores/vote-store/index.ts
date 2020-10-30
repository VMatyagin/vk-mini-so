import { cast, types } from "mobx-state-tree";
import { Poll, Question, Vote } from "./types";

const PollModel = types.model({
  id: types.number,
  title: types.string,
  isRealTime: types.boolean,
  disabled: types.boolean,
  currentQuestion: types.number,
});
const AnswerModel = types.model({ id: types.number, answer: types.string });
const QuestionModel = types.model({
  id: types.number,
  title: types.string,
  poll_answers: types.array(AnswerModel),
});
const VoteModel = types.model({
  poll_answer: types.union(AnswerModel, types.number),
  poll_question: types.union(QuestionModel, types.number),
  poll: types.union(PollModel, types.number),
});
export const VoteStore = types
  .model("VoteStore", {
    vote: types.optional(PollModel, {
      id: 0,
      title: "",
      isRealTime: false,
      disabled: true,
      currentQuestion: 0,
    }),
    questions: types.optional(types.array(QuestionModel), []),
    selfVotes: types.optional(types.array(VoteModel), []),
  })
  .views((self) => ({
    currentIsVoted() {
      const vote = self.selfVotes.find(
        (vote) =>
          (typeof vote.poll_question !== "number" && vote.poll_question.id) ===
          self.questions[self.vote.currentQuestion].id
      );
      return !vote ? 0 : self.questions[self.vote.currentQuestion].id;
    },
  }))
  .actions((self) => ({
    setVote(data: Poll) {
      self.vote = {
        ...data,
      };
    },
    setQuestions(data: Question[]) {
      self.questions = cast([...data]);
    },
    setSelfVotes(data: Vote[]) {
      self.selfVotes = cast([...data]);
    },
  }));
