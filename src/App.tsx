/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { FilterOptions, Todo } from './types';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { getPrepearedTodos } from './utils/getPrepearedTodos';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterCompleting, setFilterCompleting] = useState<FilterOptions>(
    FilterOptions.ALL,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        //setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddTodo = async (title: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const temporaryTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(temporaryTodo);
    setIsLoading(true);

    try {
      const response = await createTodo(newTodo);

      setIsLoading(true);
      setTodos(prevTodos => [...prevTodos, response]);
      setTempTodo(null);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      //setTimeout(() => setErrorMessage(''), 3000);
      setTempTodo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    //setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleDeleteTodo = async (id: number) => {
    setIsLoading(true);
    setDeletingTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        //setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setDeletingTodoId(null);
      });
  };

  // const handleClearCompleted = async () => {
  //   setIsLoading(true);

  //   const completedTodos = todos.filter(todo => todo.completed);
  //   const deletionPromises = completedTodos.map(todo =>
  //     deleteTodo(todo.id).catch(error => error),
  //   );

  //   try {
  //     const results = await Promise.all(deletionPromises);
  //     const failedDeletions = results.filter(result => result instanceof Error);

  //     if (failedDeletions.length > 0) {
  //       setErrorMessage('Unable to delete some completed todos');
  //       setTimeout(() => setErrorMessage(''), 3000);
  //     }

  //     setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  //   } catch (error) {
  //     setErrorMessage('Unable to delete completed todos');
  //     setTimeout(() => setErrorMessage(''), 3000);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const filteredTodos = useMemo(
    () => getPrepearedTodos(todos, filterCompleting),
    [todos, filterCompleting],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          onError={handleError}
          isError={!!errorMessage}
          isLoading={isLoading}
          isAllCompleted={todos.every(todo => todo.completed)}
        />
        {/* <header className="todoapp__header"> */}
        {/* this button should have `active` class only if all todos are completed */}
        {/* <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          /> */}

        {/* Add a todo on form submit */}
        {/* <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header> */}

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          isLoading={isLoading}
          deletingTodoId={deletingTodoId}
        />
        {todos.length && (
          <Footer
            todos={todos.filter(todo => !todo.completed)}
            filter={filterCompleting}
            setFilter={setFilterCompleting}
            isAllActive={todos.every(todo => !todo.completed)}
            onDelete={handleDeleteTodo}
          />
        )}

        {/* <section className="todoapp__main" data-cy="TodoList"> */}
        {/* This is a completed todo */}
        {/* <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Completed Todo
            </span> */}

        {/* Remove button appears only on hover */}
        {/* <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

        {/* overlay will cover the todo while it is being deleted or updated */}
        {/* <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

        {/* This todo is an active todo */}
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
          </div>
        </section> */}

        {/* Hide the footer if there are no todos */}
        {/* <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            3 items left
          </span> */}

        {/* Active link should have the 'selected' class */}
        {/* <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className="filter__link selected"
              data-cy="FilterLinkAll"
            >
              All
            </a>

            <a
              href="#/active"
              className="filter__link"
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              href="#/completed"
              className="filter__link"
              data-cy="FilterLinkCompleted"
            >
              Completed
            </a>
          </nav> */}

        {/* this button should be disabled if there are no completed todos */}
        {/* <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer> */}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error
        errorMessage={errorMessage}
        onCloseErrorMessage={() => setErrorMessage('')}
      />
      {/* <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage} */}
      {/* show only one message at a time */}
      {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      {/* </div> */}
    </div>
  );
};
