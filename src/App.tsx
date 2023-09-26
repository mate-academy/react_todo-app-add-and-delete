/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { TodoAddForm } from './components/TodoAddForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { ErrorMessage, Filter, Todo } from './types/Todo';
import { TodoError } from './components/TodoError';
// import { TodoLoader } from './components/TodoLoader';

export const USER_ID = 11579;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [title, setTitle] = useState('');
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTempTodoLoading, setIsTempTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = (errorMsg: ErrorMessage) => {
    setError(errorMsg);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        // setError(ErrorMessage.noTodos);
        // setTimeout(() => {
        //   setError('');
        // }, 3000);

        handleError(ErrorMessage.noTodos);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const activeTodos = todos.filter((todo) => !todo.completed);

    setCounter(activeTodos.length);
  }, [todos]);

  const getVisibleTodos = () => {
    const visible = todos.filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return visible;
  };

  const visibleTodos = getVisibleTodos();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (title.trim() === '') {
      handleError(ErrorMessage.noTitle);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsTempTodoLoading(true);
    setTempTodo({ ...newTodo, id: 0 });
    addTodo(newTodo)
      .then(response => {
        setTitle('');
        setTodos(oldTodos => [...oldTodos].concat(response));
      })
      .catch(() => {
        handleError(ErrorMessage.noAddTodo);
      })
      .finally(() => {
        setIsTempTodoLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoID: number) => {
    setIsLoading(true);
    deleteTodo(todoID)
      .then(() => {
        setTitle('');
        setTodos(oldTodos => oldTodos.filter(todo => todo.id !== todoID));
      })
      .catch(() => {
        handleError(ErrorMessage.noDeleteTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoAddForm
            title={title}
            setTitle={setTitle}
            onSubmit={handleSubmit}
            isLoading={isTempTodoLoading}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
            isLoading={isLoading}
            isTempTodoLoading={isTempTodoLoading}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${counter} items left`}
            </span>

            <TodoFilter filter={filter} setFilter={setFilter} />

            {/* don't show this button if there are no completed todos */}
            {todos.some((todo) => todo.completed) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      <TodoError error={error} setError={setError} />
    </div>
  );
};
