import React from 'react';
import cn from 'classnames';

import { useDispatchContext, useStateContext } from './GlobalStateProvider';

import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const { title, todos } = useStateContext();
  const dispatch = useDispatchContext();

  const [adding, setAdding] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_TITLE',
      payload: e.target.value,
    });
  };

  const handleAddTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (title.trim() === '') {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Title should not be empty',
        });

        return;
      }

      const id = Date.now();

      const tempTodo = {
        id,
        title: title.trim(),
        completed: false,
        loading: true,
      };

      dispatch({
        type: 'ADD_TODO',
        payload: tempTodo,
      });

      setAdding(true);

      todoService
        .addTodo(title.trim())
        .then(todo => {
          dispatch({
            type: 'DELETE_TODO',
            payload: tempTodo,
          });
          dispatch({
            type: 'ADD_TODO',
            payload: todo,
          });
          dispatch({
            type: 'SET_TITLE',
            payload: '',
          });
        })
        .catch(() => {
          dispatch({
            type: 'SET_ERROR',
            payload: 'Unable to add a todo',
          });
          dispatch({
            type: 'DELETE_TODO',
            payload: tempTodo,
          });
        })
        .finally(() => {
          setAdding(false);
          inputRef.current?.focus();
        });
    }
  };

  const handleOnUpdateTodo = (todo: Todo) => {
    dispatch({
      type: 'SET_LOADING',
      payload: {
        id: todo.id,
        loading: true,
      },
    });
    todoService
      .updateTodo(todo)
      .then(updatedTodo => {
        dispatch({
          type: 'UPDATE_TODO',
          payload: updatedTodo,
        });
      })
      .catch(() => {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to update a todo',
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
  //eslint-disable-next-line
  const handleOnToggleAllTodos = (todos: Todo[]) => {
    todos.forEach(todo => {
      const updatedTodos = {
        ...todo,
        completed: !todo.completed,
      };

      handleOnUpdateTodo(updatedTodos);
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleOnToggleAllTodos(todos)}
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleAddTodo}
          disabled={adding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
