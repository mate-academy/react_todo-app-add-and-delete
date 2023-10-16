import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { Todo } from '../types/Todo';
import { TodosState } from '../types/TodosState';
import { TodosAction } from '../types/TodosAction';

const todosReducer = (state: Todo[], action: TodosAction): Todo[] => {
  switch (action.type) {
    case 'initialize':
      return [...state, ...action.payload];
    case 'create':
      return [
        ...state,
        action.payload,
      ];
    case 'delete':
      return state.filter(todo => todo.id !== action.payload);
    case 'toggle completed status':
      return state.map(todo => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
    case 'clear all completed':
      return state.filter(todo => !action.payload.includes(todo.id));
    default:
      return state;
  }
};

const initialState: TodosState = [
  [],
  () => { },
];

const TodosContext = createContext(initialState);

type Props = {
  children: ReactNode,
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, todosDispatch] = useReducer(todosReducer, []);

  const value: TodosState = useMemo(() => ([
    todos,
    todosDispatch,
  ]), [todos, todosDispatch]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosState = () => useContext(TodosContext);
