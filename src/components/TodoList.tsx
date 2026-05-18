// .. TodoList.tsx
import type { Todo } from '../types/Todo';
import { useState } from 'react';
import { TempTodoItem } from './TempTodoItem';

interface TodoListProps {
  todos: Todo[];
  handleDelete: (id: number) => void;
  toggleTodo: (todo: Todo) => void;
  loadingIds: number[];
  updateTodoItem: (id: number, title: string) => void;
  tempTodo: Todo | null;
}

export const TodoList = ({
  todos,
  handleDelete,
  toggleTodo,
  loadingIds,
  updateTodoItem,
  tempTodo,
}: TodoListProps) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null); //.. стан для редагованої тудушки
  const [editedTitle, setEditedTitle] = useState('');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditdSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingTodoId === null) {
      return;
    }

    updateTodoItem(editingTodoId, editedTitle);
    setEditingTodoId(null);
  };

  const editTodo = (id: number, title: string) => {
    setEditingTodoId(id);
    setEditedTitle(title);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return editingTodoId === todo.id ? (
          <div data-cy="Todo" className="todo" key={todo.id}>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                aria-label="Toggle todo status"
                checked={todo.completed}
              />
            </label>

            <form onSubmit={handleEditdSubmit}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle || ''}
                onChange={handleQueryChange}
                autoFocus
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ) : (
          <div
            data-cy="Todo"
            className={!todo.completed ? 'todo' : 'todo completed'}
            key={todo.id}
            onDoubleClick={() => {
              editTodo(todo.id, todo.title);
            }}
          >
            <label
              htmlFor={`todo-status-${todo.id}`}
              className="todo__status-label"
              aria-label="Toggle todo status"
            >
              <input
                id={`todo-status-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
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
                handleDelete(todo.id);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={`modal overlay ${
                loadingIds.includes(todo.id) ? 'is-active' : ''
              }`}
            >
              {/* <div className="modal-background has-background-white-ter" />
              <div className="loader" /> */}
            </div>
          </div>
        );
      })}
      {tempTodo !== null ? <TempTodoItem tempTodo={tempTodo} /> : null}
    </section>
  );
};
