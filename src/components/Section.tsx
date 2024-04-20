import React from 'react';
import cn from 'classnames';

import { useDispatchContext, useStateContext } from './GlobalStateProvider';
import * as todoService from '../api/todos';

import { Todo } from '../types/Todo';

export const Section: React.FC = () => {
  const { todos, filter, selectedTodo, selectedTitle } = useStateContext();

  const dispatch = useDispatchContext();

  React.useEffect(() => {
    todoService
      .getTodos()
      //eslint-disable-next-line
      .then(todos => {
        dispatch({
          type: 'SET_TODOS',
          payload: todos,
        });
      })
      .catch(() => {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to load todos',
        });
      });
  }, [dispatch]);

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleOnTodoSelect = (todo: Todo) => {
    dispatch({
      type: 'SET_SELECTED_TODO',
      payload: todo,
    });

    dispatch({
      type: 'SET_SELECTED_TITLE',
      payload: todo.title,
    });
  };

  const handleOnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SELECTED_TITLE',
      payload: e.target.value,
    });
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

  const handleSaveOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedTodo && selectedTitle.trim() === '') {
        dispatch({
          type: 'DELETE_TODO',
          payload: selectedTodo,
        });
        handleOnDeleteTodo(selectedTodo);
      } else {
        if (selectedTodo) {
          const updatedTodo = {
            ...selectedTodo,
            title: selectedTitle,
          };

          handleOnUpdateTodo(updatedTodo);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dispatch({
        type: 'SET_SELECTED_TODO',
        payload: null,
      });
    }
  };

  const handleOnBlur = () => {
    if (selectedTodo) {
      const updatedTodo = {
        ...selectedTodo,
        title: selectedTitle,
      };

      handleOnUpdateTodo(updatedTodo);
    }
  };

  const handleOnToggleTodo = (todo: Todo) => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    handleOnUpdateTodo(updatedTodo);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {getFilteredTodos().map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          {/* eslint-disable-next-line */}
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${todo.id}`}
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleOnToggleTodo(todo)}
              id={`todo-status-${todo.id}`}
            />
          </label>
          {selectedTodo === todo ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={selectedTitle}
                onChange={handleOnTitleChange}
                onKeyDown={handleSaveOnKeyDown}
                onBlur={handleOnBlur}
                autoFocus
                disabled={todo.loading}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onClick={() => handleOnTodoSelect(todo)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleOnDeleteTodo(todo)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={cn('modal', 'overlay', {
                  'is-active': todo.loading,
                })}
              >
                <div
                  className="
                    modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
};
