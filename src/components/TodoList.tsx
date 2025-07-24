/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import * as todosApi from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[];
  setTodoStatus: (status: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  edditingTodoTitle: string;
  setEdditingTodoTitle: (title: string) => void;
  edditingTodo?: number;
  setEdditingTodo: (id?: number) => void;
  todoStatus: boolean;
  setError: (error: string) => void;
  todos?: Todo[];
  todoLoaderId: number;
  setTodoLoaderId: (todoIdLoader: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  setTodoStatus,
  setTodos,
  inputRef,
  edditingTodoTitle,
  setEdditingTodoTitle,
  edditingTodo,
  setEdditingTodo,
  todoStatus,
  setError,
  todoLoaderId,
  setTodoLoaderId,
}) => {
  const handleToggleTodoStatus = (todo: Todo) => {
    setTodoStatus(true);
    setTodoLoaderId(todo.id);
    todosApi
      .updateTodo(todo.id, !todo.completed, todo.title)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTodoStatus(false);
        setTodoLoaderId(0);
      });
  };

  const handleToBlur = (currentTodoItem: Todo) => {
    setTodoStatus(true);
    setTodoLoaderId(currentTodoItem.id);
    const trimmedTitle = edditingTodoTitle.trim();

    todosApi
      .updateTodo(currentTodoItem.id, currentTodoItem.completed, trimmedTitle)
      .then(updatedTodo => {
        setTodos(prev => {
          const newTodos = [...prev];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
        setEdditingTodoTitle(trimmedTitle);
        setEdditingTodo(undefined);
      })
      .catch(() => {
        setError('Unable to update a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTodoStatus(false);
        setTodoLoaderId(0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodoStatus(true);
    setTodoLoaderId(todoId);

    todosApi
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTodoStatus(false);
        setTodoLoaderId(0);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todoToMap => (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todoToMap.completed,
          })}
          key={todoToMap.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todoToMap.completed}
              onChange={() => handleToggleTodoStatus(todoToMap)}
            />
          </label>

          {edditingTodo === todoToMap.id ? (
            <form onSubmit={e => e.preventDefault()}>
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={edditingTodoTitle}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const trimmed = e.currentTarget.value.trim();

                    if (trimmed === todoToMap.title) {
                      setEdditingTodo(undefined);
                      setEdditingTodoTitle('');
                    } else if (trimmed) {
                      handleToBlur(todoToMap);
                    } else {
                      handleDeleteTodo(todoToMap.id);
                    }
                  } else if (e.key === 'Escape') {
                    setEdditingTodo(undefined);
                    setEdditingTodoTitle(todoToMap.title);
                  }
                }}
                onChange={e => setEdditingTodoTitle(e.currentTarget.value)}
                onBlur={() => {
                  const trimmed = edditingTodoTitle.trim();

                  if (trimmed === todoToMap.title) {
                    setEdditingTodo(undefined);
                    setEdditingTodoTitle('');
                  } else if (trimmed) {
                    handleToBlur(todoToMap);
                  } else {
                    handleDeleteTodo(todoToMap.id);
                  }
                }}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEdditingTodo(todoToMap.id);
                  setEdditingTodoTitle(todoToMap.title);
                }}
              >
                {todoToMap.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todoToMap.id)}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': todoLoaderId === todoToMap.id && todoStatus,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
