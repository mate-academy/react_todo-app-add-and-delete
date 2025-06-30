/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Loader } from './Loader';
// import { Loader } from './Loader';

type Props = {
  todo: Todo;
  isLoading: boolean;
  toggleTodoCompleted: (id: number) => void;
  deleteTodo: (id: number) => void;
  handleSave: () => void;
  handleEditInput: (e: ChangeEvent<HTMLInputElement>) => void;
  editor: (todo: Todo) => void;
  editInput: string;
  editingId: number | undefined;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  toggleTodoCompleted,
  deleteTodo,
  handleSave,
  handleEditInput,
  editor,
  editInput,
  editingId,
  inputRef,
}) => {
  return (
    <div
      //item-enter-done
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoCompleted(todo.id)}
        />
      </label>

      {editingId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editInput}
            onChange={handleEditInput}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => editor(todo)}
          >
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
        </>
      )}
      <Loader isLoading={isLoading} />
    </div>
  );
};
