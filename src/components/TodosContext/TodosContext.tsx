import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

const userTodos = '/todos?userId=11813';

type Context = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  // getTodos: () => void;
  // addTodo: () => void;
  // deleteTodo: () => void;
};

export const TodosContext = React.createContext<Context>({
  todos: [],
  setTodos: () => { },
  errorMessage: '',
  setErrorMessage: () => {},
  // getTodos: () => {},
  // addTodo: () => {},
  // deleteTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    client.get(userTodos)
      .then(allTodos => {
        setTodos(allTodos as Todo[]);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const value = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
