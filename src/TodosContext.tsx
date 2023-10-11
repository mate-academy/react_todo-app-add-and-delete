import React, {
  createContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { USER_ID } from './utils/userId';

interface TodosContextProps {
  children: React.ReactNode;
}

export const TodosContext = createContext<{
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorDiv: React.RefObject<HTMLDivElement>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
}>({
  todos: [],
  setTodos: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  errorDiv: { current: null },
  tempTodo: null,
  setTempTodo: () => { },
});

export const TodosProvider: React.FC<TodosContextProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const errorDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        if (errorDiv.current !== null) {
          errorDiv.current.classList.remove('hidden');
          setTimeout(() => {
            if (errorDiv.current !== null) {
              errorDiv.current.classList.add('hidden');
              setErrorMessage('');
            }
          }, 3000);
        }
      });
  }, []);

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      errorMessage,
      setErrorMessage,
      errorDiv,
      tempTodo,
      setTempTodo,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
