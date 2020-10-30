export interface Poll {
  id: number;
  title: string;
  isRealTime: boolean;
  disabled: boolean;
  currentQuestion: number;
}
export interface Answer {
  id: number;
  answer: string;
}

export interface Question {
  id: number;
  title: string;
  poll_answers: Answer[];
}

export interface Vote {
  user: number;
  poll_answer: Answer | number;
  poll_question: Question | number;
  poll: Poll | number;
}
