/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, deleteTodo, postTodo } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoFilter } from './components/ErrorMessage/TodoFilter/TodoFilter';
import { Header } from './components/Header/Header';
import { Loader } from './components/Loader/Loader';
import { TodoList } from './components/TodoList/TodoList';
import { SortTodoBy, USER_ID } from './types';
import { TodosError } from './types/Errors';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortTodosBy, setSortTodosBy] = useState(SortTodoBy.Default);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [disableField, setDisableField] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleShowError = (text: string) => {
    setLoadingError(true);
    setErrorText(text);
  };

  const loadTodos = (userId: number) => {
    setIsLoading(true);
    setLoadingError(false);

    getTodos(userId)
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => {
        handleShowError(TodosError.FailedLoadingGoods);
        setTimeout(() => {
          setLoadingError(false);
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTodos(USER_ID);
  }, []);

  const handleCloseError = () => {
    setLoadingError(false);
  };

  const visiableTodos = todos.filter(todo => {
    switch (sortTodosBy) {
      case SortTodoBy.Completed:
        return todo.completed;
      case SortTodoBy.Active:
        return !todo.completed;
      default:
        return todo;
    }
  });

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      handleShowError(TodosError.InvalidTitle);
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setDisableField(true);
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      await postTodo(newTodo)
        .then((response) => setTodos([...todos, response]));
    } catch {
      handleShowError(TodosError.AddTodo);
    } finally {
      setDisableField(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      const newTodos = todos.filter(todo => todo.id !== todoId);

      await deleteTodo(todoId);

      setTodos(newTodos);
    } catch {
      handleShowError(TodosError.DeleteTodo);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          disable={disableField}
          onAddTodo={handleAddTodo}
        />

        {isLoading && (
          <Loader />
        )}

        <TodoList
          todos={visiableTodos}
          tempTodo={tempTodo}
          deleteTodo={handleDeleteTodo}
        />

        {visiableTodos.length > 0 && (
          <TodoFilter
            changeSortBy={setSortTodosBy}
          />
        )}
      </div>

      {loadingError && (
        <ErrorMessage
          text={errorText}
          onClose={handleCloseError}
          showError={loadingError}
        />
      )}
    </div>
  );
};
