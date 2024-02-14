import {
  FC, ReactNode, createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';

  type Props = {
    children: ReactNode,
  };

  type TodoProviderT = {
    todos: Todo[],
    setTodos: (React.Dispatch<React.SetStateAction<Todo[] | any>>),
    errorMessage: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    option: string,
    setOption: React.Dispatch<React.SetStateAction<string>>,
    visibleTodos: Todo[],
    tempTodo: Todo | null,
    setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
    uncompletedCounter: number,
    USER_ID: number | null,
  };

const TodoContext = createContext<TodoProviderT>({
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  option: '',
  setOption: () => {},
  visibleTodos: [],
  tempTodo: null,
  setTempTodo: () => {},
  uncompletedCounter: 0,
  USER_ID: null,
});

const TodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [option, setOption] = useState<string>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [uncompletedCounter, setUncompletedCounter] = useState<number>(0);
  const USER_ID = 12121;

  useEffect(() => {
    setErrorMessage('');
    getTodos(12121)
      .then(data => setTodos(data))
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const visibleTodos = useMemo(() => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    setUncompletedCounter(uncompletedTodos.length);

    return todos
      .filter(todo => {
        switch (option) {
          case 'active':
            return !todo.completed;
          case 'completed':
            return todo.completed;
          default:
            return todo;
        }
      });
  }, [option, todos]);

  const value = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    option,
    setOption,
    visibleTodos,
    tempTodo,
    setTempTodo,
    uncompletedCounter,
    USER_ID,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;

export const useTodos = () => useContext(TodoContext);
