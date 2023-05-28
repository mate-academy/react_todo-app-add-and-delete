import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { FilterOptions } from './types/FilterOptions';
import { filteringTodos } from './utils/filteringTodos';
import { Notification } from './components/Notification';
import { Errors } from './types/Errors';
import { NotificationContext } from './context/NotificationContext';
import { LoadingContext } from './context/LoadingContext';

const USER_ID = 10516;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    filterOption,
    setFilterOption,
  ] = useState<FilterOptions>(FilterOptions.All);

  const { errorMessage, setErrorMessage } = useContext(NotificationContext);
  const {
    focusInput,
    disableInput,
    addTodoIdToLoading,
    deleteTodoIdFromLoading,
  } = useContext(LoadingContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.Loading));
  }, []);

  const currentTodos = useMemo(() => {
    return filteringTodos(todos, filterOption);
  }, [todos, filterOption]);

  const todosCountByStatus = useMemo(() => {
    return {
      active: filteringTodos(todos, FilterOptions.Active).length,
      completed: filteringTodos(todos, FilterOptions.Completed).length,
    };
  }, [todos]);

  const addNewTodoToMainTodosList = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const deleteTodoFromMainTodosList = (todoId: number) => {
    setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
  };

  const addNewTodo = useCallback((title: string) => {
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    disableInput();
    addTodoIdToLoading(0);
    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then(addNewTodoToMainTodosList)
      .catch(() => setErrorMessage(Errors.Adding))
      .finally(() => {
        deleteTodoIdFromLoading(0);
        setTempTodo(null);
        focusInput();
      });
  }, []);

  const deleteCurrentTodo = useCallback((todoId: number) => {
    addTodoIdToLoading(todoId);

    deleteTodo(todoId)
      .then(() => deleteTodoFromMainTodosList(todoId))
      .catch(() => setErrorMessage(Errors.Deletion))
      .finally(() => {
        deleteTodoIdFromLoading(todoId);
      });
  }, []);

  const handleDeleteCompletedTodos = useCallback(() => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        deleteCurrentTodo(id);
      }
    });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosCount={todosCountByStatus.active}
          addNewTodo={addNewTodo}
        />

        <TodosList
          todos={currentTodos}
          tempTodo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
        />

        {!!todos.length && (
          <Footer
            todosCountByStatus={todosCountByStatus}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <Notification />
      )}
    </div>
  );
};
