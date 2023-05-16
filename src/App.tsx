/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { SortType } from './types/SortType';
import { Error } from './Components/Error';

const USER_ID = 10390;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [sort, setSort] = useState(SortType.All);
  const [errorMessage, setErrorMessage] = useState('');

  const completedTodo = todos.filter(todo => todo.completed === true);
  const activeTodo = todos.length - completedTodo.length;

  const getFiltered = (filter: SortType) => {
    switch (filter) {
      case SortType.Active:
        return todos.filter(todo => !todo.completed);

      case SortType.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const onDeleteError = () => setErrorMessage('');

  useEffect(() => {
    getTodos(USER_ID).then(todosFromServer => {
      setTodos(todosFromServer);
      setFilteredTodos(todosFromServer);
    })
      .catch(error => setErrorMessage(error.message));
  }, []);

  useEffect(() => setFilteredTodos(getFiltered(sort)), [sort]);

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
            className={classNames(
              'todoapp__toggle-all', {
                active: getFiltered(SortType.Completed)
                && filteredTodos.length === todos.length,
              },
            )}
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        <TodoList todosFromServer={filteredTodos} />

        {todos.length > 0
        && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodo} items left`}
            </span>
            <TodoFilter sort={sort} setSort={setSort} />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <Error message={errorMessage} onDelete={onDeleteError} />
    </div>
  );
};
