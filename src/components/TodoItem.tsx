import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext, UpdateTodosContext } from '../context/todosContext';

interface Props {
  todo: Todo;
}

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    loading,
    selectedTodos,
  } = useContext(TodosContext);

  const {
    onDeleteTodo,
    setSelectedTodos,
  } = useContext(UpdateTodosContext);

  const isTodoSelected = selectedTodos.some(
    todoItem => todo.id === todoItem.id,
  );

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      {isEditing && isTodoSelected ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodos(currentTodos => [...currentTodos, todo]);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}

      {loading && isTodoSelected && (
        <div
          className={cn('modal overlay', {
            'is-active': loading,
          })}
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
