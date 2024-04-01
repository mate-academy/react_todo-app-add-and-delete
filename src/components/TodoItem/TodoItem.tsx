import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../TodosProvider';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { deleteTodo, selectedTodoIds, setTodos } = useTodos();

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleToggleTodo = () => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.map(todoItem =>
        todoItem.id === todo.id
          ? { ...todoItem, completed: !todo.completed }
          : todoItem,
      );

      return updatedTodos;
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      setEditedTitle(todo.title);
      setEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${cn({
        completed: todo.completed,
      })}`}
      key={todo.id}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            value={editedTitle}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={handleToggleTodo}
              aria-label="Todo status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': selectedTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
