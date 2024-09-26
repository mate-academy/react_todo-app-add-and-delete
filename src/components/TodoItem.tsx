/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, FC, KeyboardEvent, useState } from 'react';
import { Todo } from '../types';
import { useTodos } from '../utils/TodosContext';
import cn from 'classnames';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const { setTodos, removeTodo, loadingTodosIds } = useTodos();
  const [idToEdit, setIdToEdit] = useState<number | null>(null);
  const [textToEdit, setTextToEdit] = useState(todo.title);
  const isLoadingActive = loadingTodosIds.includes(todo.id) || todo.id === 0;
  const isEditing = !idToEdit && idToEdit !== todo.id;

  const toggleCompletedTodo = (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(prev =>
        prev.id === todoId ? { ...prev, completed: !prev.completed } : prev,
      ),
    );
  };

  const toggleEditTodo = (todoId: number) => {
    setIdToEdit(todoId);
    setTextToEdit(todo.title);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextToEdit(e.target.value);
  };

  const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      const newText = textToEdit.trim();

      if (!newText) {
        removeTodo(id);
      } else {
        setTodos(prevTodos =>
          prevTodos.map(prev =>
            prev.id === id ? { ...prev, title: newText } : prev,
          ),
        );
      }

      setIdToEdit(null);

      return;
    }

    if (e.key === 'Escape') {
      setIdToEdit(null);
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

      {isEditing ? (
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
            value={textToEdit}
            onChange={handleInputChange}
            onKeyUp={e => handleInputKeyUp(e, todo.id)}
            onBlur={() => setIdToEdit(null)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoadingActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
