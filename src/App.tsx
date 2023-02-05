/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { DeleteContext } from './context/DeleteContext';
import { ErrorMessage } from './enums/ErrorMessage';
import { Filter } from './enums/Filter';
import { normalizeTodos } from './helpers/helpers';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = (useState(Filter.ALL));
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);

  const loadTodos = async (userID: number) => {
    setIsLoading(true);
    try {
      const serverTodos = await getTodos(userID);
      const normalizedTodos = normalizeTodos(serverTodos);

      setUserTodos(normalizedTodos);
    } catch {
      setErrorMessage(ErrorMessage.LOAD);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTodos(user.id);
    }
  }, [user]);

  const addTodo = async (todoTitle: string) => {
    if (!user) {
      return;
    }

    try {
      setIsAdding(true);
      const temp = {
        id: 0,
        completed: false,
        userId: user?.id,
        title: todoTitle,
      };

      setTempTodo(temp);
      const newTodo = await createTodo(temp);

      setUserTodos(current => {
        const {
          id,
          userId,
          title,
          completed,
        } = newTodo;

        return [
          ...current,
          {
            id,
            userId,
            title,
            completed,
          },
        ];
      });
    } catch {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setIsDeleting(true);
      setDeletedId(id);

      await removeTodo(id);
      setUserTodos(current => (
        current.filter(todo => todo.id !== id)
      ));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setIsDeleting(false);
      setDeletedId(-1);
    }
  };

  const getVisibleTodos = () => {
    switch (filterStatus) {
      case Filter.ACTIVE:
        return userTodos.filter((todo) => !todo.completed);
      case Filter.COMPLETED:
        return userTodos.filter((todo) => todo.completed);
      default:
        return userTodos;
    }
  };

  const clearCompleted = useCallback(() => {
    const finishedTodos = userTodos.filter(todo => todo.completed);

    if (finishedTodos.length > 0) {
      finishedTodos.forEach(todo => deleteTodo(todo.id));
    }
  }, [userTodos]);

  const clearError = useCallback(() => setErrorMessage(null), []);

  const visibleTodos = useMemo(getVisibleTodos, [filterStatus, userTodos]);

  const unfinishedTodosLeft = useMemo(() => {
    return userTodos.filter(todo => !todo.completed).length;
  }, [userTodos]);
  const isAllFinished = userTodos.length - unfinishedTodosLeft === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          isAllFinished={isAllFinished}
          setError={setErrorMessage}
          isAdding={isAdding}
          addTodo={addTodo}
        />

        {isLoading && (
          <Loader />
        )}

        {!!userTodos.length && (
          <>
            <DeleteContext.Provider value={
              {
                isDeleting,
                deletedId,
              }
            }
            >
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                deleteTodo={deleteTodo}
              />
            </DeleteContext.Provider>
            <Footer
              unfinishedTodosLeft={unfinishedTodosLeft}
              activeFilter={filterStatus}
              setFilter={setFilterStatus}
              isAllFinished={isAllFinished}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          clearError={clearError}
        />
      )}
    </div>
  );
};
