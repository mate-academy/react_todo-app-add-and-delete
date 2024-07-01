/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';

import { Status } from './types/Status';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  function getVisiebleTodos(newTodos: Todo[], newStatus: Status) {
    switch (newStatus) {
      case Status.Active:
        return newTodos.filter(todo => !todo.completed);

      case Status.Completed:
        return newTodos.filter(todo => todo.completed);

      default:
        return newTodos;
    }
  }

  const visiebleTodos = getVisiebleTodos(todos, status);

  const addTodo = () => {
    const todoTitle = query.trim();

    if (!todoTitle.length) {
      setError('Title should not be empty');
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
    setLoadingTodos(c => [...c, 0]);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(curTodos => [...curTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(c => c.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(curr => [...curr, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() =>
        setLoadingTodos(curr =>
          curr.filter(deletingTodoId => todoId !== deletingTodoId),
        ),
      );

    inputRef.current?.focus();
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllComleted = () => {
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
            visiebleTodos={visiebleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            loadingTodos={loadingTodos}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            onClearCompleted={deleteAllComleted}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
