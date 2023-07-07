/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { KeyboardEvent, useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import { deleteTodo } from '../api/todos';

interface TodoProps {
  todo: TodoType,
  temp:boolean,
  deleteTask: (id: number) => void,
  setError: (error:string) => void,
}

export const Todo: React.FC<TodoProps> = ({
  todo, temp, deleteTask, setError,
}) => {
  const [editable, setEditable] = useState(false);
  const [titleState, setTitleState] = useState(todo.title);
  const [inProgress, setInProgress] = useState(temp);

  const {
    completed,
  } = todo;

  const handleRemoveTodo = () => {
    setInProgress(true);
    deleteTodo(todo.id)
      .then(res => {
        if (res) {
          deleteTask(todo.id);
        }
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      setEditable(false);
    }
  };

  return (
    <div className={`todo ${completed
      ? 'completed'
      : ''}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      {editable
        ? (
          <form>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleState}
              onChange={(event) => setTitleState(event?.target.value)}
              onKeyDown={handleEnter}
              onBlur={() => {
                setEditable(false);
              }}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onClick={() => setEditable(true)}
            >
              {titleState}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}
      <div className={`modal overlay ${inProgress ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
