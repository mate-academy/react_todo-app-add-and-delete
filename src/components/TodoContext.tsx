import React, { useEffect, useState } from 'react';
import { TodosContextType } from '../types/TodoContext';
import { Todo } from '../types/Todo';
import { createTodo, deleteTodo, getTodos } from '../api/todos';
import { ErrorType } from '../types/Error';

const USER_ID = 11121;

export const TodosContext = React.createContext<TodosContextType | null>(null);

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError(ErrorType.fetchError);
      });
  }, []);

  const resetError = () => {
    setError('');
  };

  const handleSetError = (errorType: string) => {
    setError(errorType);
  };

  const addTodo = (title: string) => {
    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setDisabledInput(true);

    return createTodo(newTempTodo)
      .then((createdTodo) => {
        setTempTodo(null);
        setTodos(prevTodos => [createdTodo, ...prevTodos]);
        setError('');
      })
      .catch(() => {
        setTempTodo(null);
        setError(ErrorType.addTodo);
      })
      .finally(() => {
        setDisabledInput(false);
      });
  };

  const removeTodo = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(
          currentTodos => currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorType.deleteTodo);
      });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      error,
      resetError,
      addTodo,
      removeTodo,
      handleSetError,
      disabledInput,
      tempTodo,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
