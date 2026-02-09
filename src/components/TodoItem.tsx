import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  loadingTodos: number | null;
  handleCheckTodo: (id: number) => void;
  onSave: (
    todoEdited: Todo,
    event: React.FormEvent<HTMLFormElement | HTMLInputElement>,
  ) => void;
  editingTodo: boolean;
  onEditing: () => void;
  onDelete: () => void;
};

export function TodoItem({
  todo,
  loadingTodos,
  handleCheckTodo,
  onSave,
  editingTodo,
  onEditing,
  onDelete,
}: TodoItemProps) {
  const [newTitle, setNewTitle] = useState<string>('');

  const handleEditTodo = (todoEdited: Todo) => {
    onEditing();
    setNewTitle(todoEdited.title);
  };

  if (editingTodo) {
    return (
      <div data-cy="Todo" className="todo" key={todo.id}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form onSubmit={event => onSave({ ...todo, title: newTitle }, event)}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={event => onSave({ ...todo, title: newTitle }, event)}
          />
        </form>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': loadingTodos === todo.id || loadingTodos === -1,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  } else {
    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
        key={todo.id}
        onDoubleClick={() => handleEditTodo(todo)}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => handleCheckTodo(todo.id)}
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': loadingTodos === todo.id || loadingTodos === -1,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }
}
