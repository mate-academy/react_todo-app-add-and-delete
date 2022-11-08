/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { ErrorType } from './types/ErrorType';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, addTodo, deleteTodo } from './api/todos';

import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [hasTodos, setHasTodos] = useState(false);
  const [hasError, setHasError] = useState<ErrorType>({ status: false });
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([0]);

  const handleSetError = (error: ErrorType) => {
    setHasError(error);
    setTimeout(() => {
      setHasError({ status: false });
    }, 3000);
  };

  const handleLoadTodos = async () => {
    try {
      setHasError({ status: false });

      const todosFromServer = await getTodos((user as User).id);

      setUserTodos(todosFromServer);
    } catch {
      handleSetError({ status: true });
    }
  };

  useEffect(() => {
    handleLoadTodos();
  }, []);

  useEffect(() => {
    if (userTodos.length !== 0) {
      setHasTodos(true);
    } else {
      setHasTodos(false);
    }
  }, [userTodos]);

  const handleCloseError = () => {
    handleSetError({ status: false });
  };

  const handleAddTodo = async (title: string) => {
    handleSetError({ status: false });

    try {
      const preparedData = {
        title,
        userId: (user as User).id,
        completed: false,
      };

      setTempTodo({ ...preparedData, id: 0 });
      setIsAdding(true);

      await addTodo(preparedData);
      await handleLoadTodos();

      setIsAdding(false);
    } catch {
      handleSetError({ status: true, message: 'Unable to add a todo' });
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    handleSetError({ status: false });

    try {
      setDeletingIds(currValue => [...currValue, id]);
      await deleteTodo(id);

      setUserTodos(currTodos => currTodos.filter(todo => todo.id !== id));
    } catch {
      handleSetError({ status: true, message: 'Unable to delete a todo' });
    } finally {
      setDeletingIds(currValue => currValue.filter(currId => currId !== id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            hasTodos={hasTodos}
            onAdd={handleAddTodo}
            onError={handleSetError}
          />
        </header>

        {hasTodos && (
          <TodoList
            todos={userTodos}
            tempTodo={tempTodo}
            isAdding={isAdding}
            onDelete={handleDeleteTodo}
            deletingIds={deletingIds}
          />
        )}

        {hasError.status && (
          <TodoError
            message={hasError.message}
            onCloseError={handleCloseError}
          />
        )}
      </div>
    </div>
  );
};
