import cn from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  todo: Todo;
  isTemp: boolean;
  todosToBeDeleted: number[];
  setTodos: (todos: Todo[] | ((todos: Todo[]) => Todo[])) => void;
  setErrorMessage: (text: string) => void;
  onDeleteTodo: (id: number) => void;
};

const TodoCard: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  isTemp,
  todosToBeDeleted,
  onDeleteTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todoItem =>
        todoItem.id === id
          ? { ...todoItem, completed: !todoItem.completed }
          : todoItem,
      ),
    );
  };

  const startEditing = (id: number, title: string) => {
    setEditingTodoId(id);
    setNewTitle(title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setNewTitle('');
  };

  const saveEditing = (id: number) => {
    if (newTitle.trim() === '') {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setTodos(prevTodos =>
      prevTodos.map(todoItem =>
        todoItem.id === id ? { ...todoItem, title: newTitle } : todoItem,
      ),
    );

    cancelEditing();
  };

  const onSubmitEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (event.key === 'Enter') {
      saveEditing(id);
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(`todo`, {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      {editingTodoId !== todo.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => startEditing(todo.id, todo.title)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
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
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={cancelEditing}
            onKeyDown={e => onSubmitEditing(e, todo.id)}
            autoFocus
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isTemp || todosToBeDeleted.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoCard;
