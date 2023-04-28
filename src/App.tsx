/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/Todolist/TodoList';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { USER_ID } from './config';
import { Statuses } from './types/Common';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Statuses>(Statuses.ALL);
  const [isTodoCreating, setIsTodoCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = todos.filter((todo) => {
    switch (status) {
      case Statuses.ACTIVE:
        return !todo.completed;

      case Statuses.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const isDeleteCompletedButtonShown = todos.some((todo) => todo.completed);

  const handleDeleteCompleted = () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodoIds.map((todoId) => deleteTodo(todoId)))
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.filter((prevTodo) => !prevTodo.completed);
        });
      })
      .catch(() => {
        setError('Unable to delete todos');
      });
  };

  const handleTodoCreate = (title: string) => {
    if (!title) {
      setError("Title can't be empty");

      return;
    }

    setIsTodoCreating(true);

    const todo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...todo, id: 0 });

    createTodo(todo)
      .then((createdTodo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsTodoCreating(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((fetchedError: Error) => {
        setError(fetchedError?.message ?? 'Something went wrong');
      });
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <TodoForm
            inputDisabled={isTodoCreating}
            onFormSubmit={handleTodoCreate}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setError={setError}
        />

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">3 items left</span>

          <TodosFilter status={status} onStatusChange={setStatus} />

          {isDeleteCompletedButtonShown && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleDeleteCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
