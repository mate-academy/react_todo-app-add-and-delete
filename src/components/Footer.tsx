import React from 'react';
import cn from 'classnames';

import { useDispatchContext, useStateContext } from './GlobalStateProvider';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';

const filters = [
  { key: 'all', href: '#/' },
  { key: 'active', href: '#/active' },
  { key: 'completed', href: '#/completed' },
];

export const Footer: React.FC = () => {
  const { todos, filter } = useStateContext();
  const dispatch = useDispatchContext();

  const handleSetFilter = (key: string) => {
    dispatch({
      type: 'SET_FILTER',
      payload: key,
    });
  };

  const handleOnDeleteTodo = (todo: Todo) => {
    dispatch({
      type: 'SET_LOADING',
      payload: {
        id: todo.id,
        loading: true,
      },
    });
    todoService
      .deleteTodo(todo.id)
      .then(() => {
        dispatch({
          type: 'DELETE_TODO',
          payload: todo,
        });
      })
      .catch(() => {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to delete a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'SET_LOADING',
          payload: {
            id: todo.id,
            loading: false,
          },
        });
      });
  };

  const handleOnDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleOnDeleteTodo(todo);
      }
    });
  };

  const todosCount = todos.filter(
    todo => !todo.completed && !todo.loading,
  ).length;
  const itemText = todosCount === 1 ? 'item' : 'items';

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todosCount} ${itemText} left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {filters.map(currFilter => {
              const cyWord =
                currFilter.key.charAt(0).toUpperCase() +
                currFilter.key.slice(1);

              return (
                <a
                  key={currFilter.key}
                  href={currFilter.href}
                  className={cn('filter__link', {
                    selected: currFilter.key === filter,
                  })}
                  data-cy={`FilterLink${cyWord}`}
                  onClick={() => handleSetFilter(currFilter.key)}
                >
                  {currFilter.key}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleOnDeleteCompletedTodos}
            disabled={!todos.some(todo => todo.completed)}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
