import React, { useState } from 'react';
import { ContextProps, Error } from '../../types';
import { ITodo } from '../../types/ITodo';
import { User } from '../../types/User';
import { AuthForm } from '../Auth/AuthForm';

export const AppContext = React.createContext<ContextProps>({
  userId: 0,
  todos: [],
  error: Error.None,
  tempTodo: null,
  isLoadingMany: false,
  isDeleting: false,
  setTodos: () => {},
  setError: () => {},
  setTempTodo: () => {},
  setIsLoadingMany: () => {},
  setIsDeleting: () => {},
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isLoadingMany, setIsLoadingMany] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<ITodo | null>(null);
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <AuthForm onLogin={setUser} />;
  }

  const contextValue = {
    userId: user.id,
    todos,
    error,
    tempTodo,
    isLoadingMany,
    isDeleting,
    setTodos,
    setError,
    setTempTodo,
    setIsLoadingMany,
    setIsDeleting,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
