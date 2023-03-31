export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export interface TodoToSend {
  title: string,
  userId: number,
  completed: boolean,
};
