import classNames from 'classnames';
import { TodoEditForm } from './TodoEditForm';
import { RemoveTodo } from './RemoveTodo';
import { TodoContext } from './TodoContext';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, editingId, setEditingId, setEditingTitle, deleteTodo } =
    React.useContext(TodoContext)!;

  const updateMark = async (id: number, completed: boolean) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, loading: true } : t)),
    );
    await new Promise(resolve => setTimeout(resolve, 700));
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed, loading: false } : t)),
    );
  };

  const handleRemove = async (id: number) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, loading: true } : t)),
    );
    await deleteTodo(id);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo"
          disabled={todo.loading}
          checked={todo.completed}
          onChange={() => {
            if (!todo.loading) {
              updateMark(todo.id, !todo.completed);
            }
          }}
        />
      </label>

      {editingId === todo.id ? (
        <TodoEditForm todo={todo} />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(todo.id);
            setEditingTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingId !== todo.id && (
        <RemoveTodo todo={todo} onRemove={handleRemove} />
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
