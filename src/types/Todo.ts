export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoType extends Todo {
  isOk?: boolean;
}
