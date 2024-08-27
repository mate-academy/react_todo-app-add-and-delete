/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';

import { Status } from './types/Status';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { Header } from './components/Header/Header';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosCount, setLoadingTodosCount] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.UnableToLoadTodos);
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  function getVisibleTodos(newTodos: Todo[], newStatus: Status) {
    switch (newStatus) {
      case Status.Active:
        return newTodos.filter(todo => !todo.completed);

      case Status.Completed:
        return newTodos.filter(todo => todo.completed);

      default:
        return newTodos;
    }
  }

  const visibleTodos = getVisibleTodos(todos, status);

  const addTodo = () => {
    const todoTitle = query.trim();

    if (!todoTitle.length) {
      setError(ErrorMessages.TitleShouldNotBeEmpty);
      setTimeout(() => setError(''), 3000);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTempTodo = {
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingTodosCount(currentCount => [...currentCount, 0]);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessages.UnableToAddTodo);
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodosCount(currentCount =>
          currentCount.filter(todoId => todoId !== 0),
        );
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodosCount(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setError(ErrorMessages.UnableToDeleteTodo);
        setTimeout(() => setError(''), 3000);
      })
      .finally(() =>
        setLoadingTodosCount(current =>
          current.filter(deletingTodoId => todoId !== deletingTodoId),
        ),
      );

    inputRef.current?.focus();
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
        />
        {!!todos.length && (
          <TodoList
            visiebleTodos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            loadingTodos={loadingTodosCount}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            onClearCompleted={deleteAllCompleted}
          />
        )}
      </div>
      <Errors error={error} setError={setError} />
    </div>
  );
};
