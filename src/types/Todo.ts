import { Status } from './Status';
export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  status: Status;
}
