/* eslint-disable jsx-a11y/label-has-associated-control */

import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';

import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[] | undefined>>;
  setError: (error: string) => void;
  deletingTodoIds: number[];
  setDeletingTodoIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  deletingTodoIds,
  setDeletingTodoIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            client
              .editTodo(todo.id, {
                ...todo,
                completed: event.target.checked,
              })
              .then(updatedTodo =>
                setTodos(previousTodos =>
                  previousTodos?.map(item => {
                    if (item.id === updatedTodo.id) {
                      return updatedTodo;
                    }

                    return item;
                  }),
                ),
              );
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setDeletingTodoIds(previousIds => [...previousIds, todo.id]);

          client
            .deleteTodo(todo.id)
            .then(() => {
              setTodos(previousTodos =>
                previousTodos?.filter(item => item.id !== todo.id),
              );
              setDeletingTodoIds([]);
            })
            .catch(() => setError('Unable to delete a todo'));
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': deletingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
