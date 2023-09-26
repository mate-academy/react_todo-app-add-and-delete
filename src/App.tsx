/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  StateContext,
} from './components/TodoContext';
import { TodoList } from './components/TodoList';
import { FILTER, ACTIONS } from './utils/enums';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const { state, dispatch } = useContext(StateContext);
  const [newTodo, setNewTodo] = useState<null | Todo>(null);

  function deleteAll() {
    state.list.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => getTodos(11384)
            .then(res => {
              dispatch({ type: ACTIONS.SET_LIST, payload: res });
            }));
      }
    });
  }

  function handleFilter(trigger: string) {
    dispatch({ type: ACTIONS.SORT, payload: trigger });
  }

  const initialTodo = {
    id: 0,
    title: query,
    userId: 11384,
    completed: false,
  };

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.code === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim()) {
        setNewTodo(initialTodo);
        addTodo(initialTodo)
          .then(() => getTodos(11384)
            .then(res => {
              dispatch({ type: ACTIONS.SET_LIST, payload: res });
              setNewTodo(null);
            }));
        setQuery('');
      }
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
            />
          </form>
        </header>

        <TodoList list={state.list} />
        {newTodo && (
          <div className={classNames('todo', {
            completed: newTodo.completed,
          })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{newTodo.title}</span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
            >

              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
        {(state.totalLength > 0 || newTodo) && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {state.totalLength}
              &nbsp;items left
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: state.sortBy === FILTER.ALL,
                })}
                onClick={() => handleFilter(FILTER.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: state.sortBy === FILTER.ACTIVE,
                })}
                onClick={() => handleFilter(FILTER.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: state.sortBy === FILTER.COMPLETED,
                })}
                onClick={() => handleFilter(FILTER.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteAll}
              style={{
                visibility: (
                  state.list.some(todo => todo.completed)
                ) ? 'visible' : 'hidden',
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {(state.error.length > 0) && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button type="button" className="delete" />
          {state.error}
        </div>
      )}
    </div>
  );
};
