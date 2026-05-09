import React from 'react';
import { TodoContext } from './TodoContext';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoEditForm: React.FC<Props> = ({ todo }) => {
  const { setTodos, editingTitle, setEditingTitle, setEditingId, deleteTodo } =
    React.useContext(TodoContext)!;

  const updateOnBlur = async (id: number, newTitle: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, loading: true } : t)),
    );
    await new Promise(resolve => setTimeout(resolve, 700));
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, title: newTitle, loading: false } : t,
      ),
    );
  };

  return (
    <>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        value={editingTitle}
        autoFocus
        disabled={todo.loading}
        onChange={e => setEditingTitle(e.target.value)}
        onBlur={async () => {
          const trimmed = editingTitle.trim();

          if (trimmed) {
            await updateOnBlur(todo.id, trimmed);
          } else {
            deleteTodo(todo.id);
          }

          setEditingId(null);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        onKeyUp={e => {
          if (e.key === 'Escape') {
            setEditingId(null);
          }
        }}
      />
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
