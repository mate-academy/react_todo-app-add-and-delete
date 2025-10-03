export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TempTodo extends Todo {
  isTemp: true;
}
