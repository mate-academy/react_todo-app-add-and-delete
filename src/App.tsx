/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Status } from './types/Status';

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

  const addTodo = (newTodoTitle: string) => {
    const todoTitle = query.trim();

    if (!todoTitle.length) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    });

    setLoadingTodos(curr => [...curr, 0]);

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
        setLoadingTodos(curr => curr.filter(todoId => todoId !== 0));
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

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            onClearCompleted={deleteAllComleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
