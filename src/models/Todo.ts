export default interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoUpdateData {
  id: number;
  title?: string;
  completed?: boolean;
}
