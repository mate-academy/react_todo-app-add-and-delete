// react
import { FC, ReactNode, useState } from 'react';
import { TodoContext } from './TodoContext';

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: FC<TodoProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodoText, setTempTodoText] = useState('');

  return (
    <TodoContext.Provider
      value={{
        isLoading,
        setIsLoading,
        errorMessage,
        setErrorMessage,
        tempTodoText,
        setTempTodoText,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
