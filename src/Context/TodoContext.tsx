import {
  Dispatch,
  FC,
  ReactNode,
  createContext,
  createRef,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoReducer } from './TodoReducer';

export type Action =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'CHECK_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'EDIT_TODO'; payload: Todo }
  | { type: 'CANCEL_TODO' }
  | { type: 'DELETE_COMPLETED_TODO'; payload: string[] }
  | { type: 'CHECK_ALL_TODO' };

export interface TodoContextType {
  todos: Todo[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  editFlag: boolean;
  editID: string;
  textToEdit: string;
  allCompleted: boolean;
  numberNotComplete: number;
  numberComplete: number;
  handleFocusInput: () => void;
}

type TProps = {
  children: ReactNode;
};

const initialState: TodoContextType = {
  todos: [],
  inputRef: createRef<HTMLInputElement>(),
  editFlag: false,
  editID: '',
  textToEdit: '',
  allCompleted: false,
  numberNotComplete: 0,
  numberComplete: 0,
  handleFocusInput: () => {},
};

export const TodoDispatch = createContext<Dispatch<Action>>(() => {});
export const TodoContext = createContext<TodoContextType>(
  initialState as TodoContextType,
);

export const TodoProvider: FC<TProps> = ({ children }) => {
  const [state, dispatch] = useReducer(
    TodoReducer as React.Reducer<TodoContextType, Action>,
    initialState as TodoContextType,
    () => {
      const localValue = localStorage.getItem('todos');

      return {
        ...initialState,
        todos: localValue ? JSON.parse(localValue) : initialState.todos,
      } as TodoContextType;
    },
  );

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const allCompleted: boolean = state.todos.every(
    (todo: Todo) => todo.completed,
  );
  const numberNotComplete: number = state.todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;
  const numberComplete: number = state.todos.filter(
    (todo: Todo) => todo.completed,
  ).length;

  const value = useMemo(
    () => ({
      ...state,
      allCompleted,
      numberNotComplete,
      numberComplete,
      inputRef,
      dispatch,
      handleFocusInput,
    }),
    [state, allCompleted, numberNotComplete, numberComplete, dispatch],
  );

  return (
    <TodoDispatch.Provider value={dispatch}>
      <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
    </TodoDispatch.Provider>
  );
};
