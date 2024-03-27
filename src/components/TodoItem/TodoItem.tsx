import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../utils/TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, removeTodo, loadingTodosIDs } = useTodos();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>(todo.title);
  const isActiveLoading = loadingTodosIDs.includes(todo.id) || todo.id === 0;

  const toggleCompletedTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(prev =>
        prev.id === id ? { ...prev, completed: !prev.completed } : prev,
      ),
    );
  };

  const toggleEditTodo = (id: number) => {
    setEditingTodoId(id);
    setEditedText(todo.title);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  const handleEditInputKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === 'Enter') {
      const newText = editedText.trim();

      if (!newText) {
        removeTodo(id);
      } else {
        setTodos(prevTodos =>
          prevTodos.map(prev =>
            prev.id === id ? { ...prev, title: newText } : prev,
          ),
        );
      }

      setEditingTodoId(null);
    } else if (e.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => toggleEditTodo(todo.id)}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleCompletedTodo(todo.id)}
        />
      </label>

      {!editingTodoId && editingTodoId !== todo.id ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedText}
            onChange={handleEditInputChange}
            onKeyUp={e => handleEditInputKeyUp(e, todo.id)}
            onBlur={() => setEditingTodoId(null)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActiveLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
