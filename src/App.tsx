/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, postTodos, deleteTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter, StatusOfFilter } from './components/TodoFilter';
import { LoadDeleteContext, LoadDeleteProvider } from './LoadDeleteContext';

const USER_ID = 9948;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(StatusOfFilter.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [value, setValue] = useState('');

  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  const { setLoadDelete } = useContext(LoadDeleteContext);

  const deleteTodo = (id: number) => {
    setTodos((prevState) => prevState.filter(todo => todo.id !== id));
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
      } catch (error) {
        setErrorMessage('Unable to fetch todos');
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const updatedTodos = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const clearCompletedTodos = () => {
    const idOfCompletedTodos = completedTodos.map(item => item.id);

    setLoadDelete([...idOfCompletedTodos]);

    idOfCompletedTodos.forEach(id => (
      deleteTodos(id)
        .then(() => deleteTodo(id))
        .catch(() => 'Clear completed error')
        .finally(
          () => setLoadDelete([]),
        )
    ));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (event.target.value.trim()) {
        const newTodo = {
          userId: USER_ID,
          title: event.target.value,
          completed: false,
        };

        const newTempTodo = {
          id: 0,
          userId: USER_ID,
          title: event.target.value,
          completed: false,
        };

        setTempTodo(newTempTodo);

        postTodos(newTodo).then(
          (data) => updatedTodos(data),
        ).catch(
          () => setErrorMessage('Unable to add todo'),
        ).finally(() => setTempTodo(null));
      } else {
        setErrorMessage("Title can't be empty");
      }

      setValue('');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case StatusOfFilter.Active:
        return !todo.completed;
      case StatusOfFilter.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadDeleteProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this buttons is active only if there are some active todos */}
            {todos.length > 0 && (
              <button
                type="button"
                className={classNames(
                  'todoapp__toggle-all',
                  {
                    active: completedTodos.length > 0,
                  },
                )}
              />
            )}

            {/* Add a todo on form submit */}
            <form>
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  handleKeyDown(event);
                }}
                disabled={!!tempTodo}
              />
            </form>
          </header>

          {todos.length > 0 && (
            <>
              <section className="todoapp__main">
                <TodoList
                  todos={filteredTodos}
                  setTodos={setTodos}
                  deleteTodo={deleteTodo}
                />
                {tempTodo && (
                  <div className="todo">
                    <label className="todo__status-label">
                      <input type="checkbox" className="todo__status" />
                    </label>

                    <span className="todo__title">{tempTodo.title}</span>
                    <button type="button" className="todo__remove">×</button>

                    {/* 'is-active' class puts this modal on top of the todo */}
                    <div className="modal overlay is-active">
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  </div>
                )}
              </section>

              {/* Hide the footer if there are no todos */}
              <footer className="todoapp__footer">
                <span className="todo-count">
                  {notCompletedTodos.length === 1 ? `${notCompletedTodos.length} item left` : `${notCompletedTodos.length} items left`}
                </span>

                {/* Active filter should have a 'selected' class */}
                <TodoFilter filter={filter} setFilter={setFilter} />

                {/* don't show this button if there are no completed todos */}
                {completedTodos.length > 0 ? (
                  <button
                    type="button"
                    className="todoapp__clear-completed"
                    onClick={clearCompletedTodos}
                  >
                    Clear completed
                  </button>
                ) : (
                  <button
                    style={{ visibility: 'hidden' }}
                    type="button"
                    className="todoapp__clear-completed"
                  >
                    Clear completed
                  </button>
                )}
              </footer>
            </>
          )}
        </div>

        {/* Notification is shown in case of any error */}
        {/* Add the 'hidden' class to hide the message smoothly */}
        <div className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      </div>
    </LoadDeleteProvider>
  );
};
