/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
// import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/Footer';
import { FilterCase } from './types/FilterCase';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterCase, setFilterCase] = useState(FilterCase.all);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  const handleAddTodo = (todoTitle: string) => {
    setIsLoading(true);

    return addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);

        newTodoField.current?.focus();
      })
      .catch(() => {
        setError('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));

        newTodoField.current?.focus();
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setLoadingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);
      handleDeleteTodo(todo.id);
    });
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filterCase) {
      case FilterCase.active:
        return !todo.completed;
      case FilterCase.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodos = todos.filter((todo) => !todo.completed);

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodos={activeTodos}
          newTodoField={newTodoField}
          error={error}
          setError={setError}
          onTodoAdd={handleAddTodo}
          isLoading={isLoading}
        />
        {/* This is a completed todo */}
        <TodoList
          todos={filteredTodos}
          // setTodos={setTodos}
          // setError={setError}
          // newTodoField={newTodoField}
          onTodoDelete={handleDeleteTodo}
          // isLoading={isLoading}
          loadingTodoIds={loadingTodoIds}
        />

        {/* This todo is not completed */}
        {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

        {/* This todo is in loadind state */}
        {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

        {/* 'is-active' class puts this modal on top of the todo */}
        {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todos={filteredTodos}
            filterCase={filterCase}
            setFilterCase={setFilterCase}
            activeTodos={activeTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
