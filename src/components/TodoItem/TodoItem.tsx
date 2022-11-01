import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  todo: Todo,
  isAdded: boolean,
  setTodos(todos: Todo[]): void,
  setError(error: string | null): void,
  isDeletingAll: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todos,
  todo,
  isAdded,
  setTodos,
  setError,
  isDeletingAll,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const removeTodo = async (todoForRemove: Todo) => {
    setIsDeleting(true);

    try {
      await deleteTodo(todoForRemove.id);

      setTodos(todos.filter(item => item.id !== todoForRemove.id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            const newTodos = todos.map(newTodo => {
              if (newTodo.id === todo.id) {
                return { ...newTodo, completed: !newTodo.completed };
              }

              return newTodo;
            });

            setTodos(newTodos);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isAdded || isDeleting
              || (isDeletingAll && todo.completed),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
