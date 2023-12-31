import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/ErrorTypes';

type Props = {
  todo: Todo,
  onCompletionChange: (todoId: number) => void,
  onRemoveTodo: (todoId: number) => void,
  onTodoEdited: (id: number, newTitle: string) => void,
  setErrorMsg: (errorMsg: Errors | null) => void,
};

export const TodoInfo: React.FC<Props> = (
  {
    todo,
    onCompletionChange,
    onRemoveTodo,
    onTodoEdited,
    setErrorMsg,
  },
) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const { title, completed, id } = todo;

  function handleCheckboxChange() {
    onCompletionChange(id);
  }

  function handleRemoveButton() {
    setIsLoading(true);
    onRemoveTodo(id);
  }

  function handleClickOnTodo() {
    setIsEdited(true);
  }

  const handleEdition: React.ChangeEventHandler<HTMLInputElement>
  = (event) => {
    try {
      setEditedTitle(event.target.value);
    } catch {
      setErrorMsg(Errors.update);
    }
  };

  function handleOnBlur() {
    onTodoEdited(id, editedTitle);
    setIsEdited(false);
  }

  function handleKeyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onTodoEdited(id, editedTitle);
      setIsEdited(false);
    }
  }

  return (
    <div data-cy="Todo" className={completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          onClick={handleCheckboxChange}
          className="todo__status"
          checked
        />
      </label>

      {isEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleEdition}
            onBlur={handleOnBlur}
            onKeyDown={(event) => handleKeyPressed(event)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleClickOnTodo}
          >
            { title }
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveButton}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className={`modal overlay ${isLoading ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
