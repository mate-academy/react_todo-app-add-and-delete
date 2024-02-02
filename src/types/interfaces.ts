/* eslint-disable max-len */
import { Dispatch, SetStateAction } from 'react';
import { Filter } from './enum';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface State {
  todos: Todo[]
  filter: Filter
}

export interface TodoContextProps {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
  handleCheck: (todo: Todo, setLoading: Dispatch<SetStateAction<boolean>>) => void;
  tempTodo: Todo | null;
  handleDeleteTodo: (todo: Todo, setLoading: Dispatch<SetStateAction<boolean>>) => void;
  deleteAllCompleted: () => void;
}
