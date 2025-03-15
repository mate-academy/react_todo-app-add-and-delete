/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import callError from '../../utils/callError';
import { MainContext } from '../../ContextProvider/ContextProvider';

type TodoProps = {
  todo: Todo;
};

const TodoItem: React.FC<TodoProps> = ({ todo }) => {
  const context = useContext(MainContext);
  const { todos, setTodos, setError, loadingIds } = context;

  const { id, title, completed } = todo;

  const [todoState, setTodoState] = useState({
    isEdited: false,
    editedValue: title,
    completed: completed,
  });

  const isLoading = useRef(loadingIds.some(x => x === id));

  if (isLoading.current) {
    setTimeout(() => (isLoading.current = false), 3000);
  }

  useEffect(() => {
    const cleanInputFocus = (event: MouseEvent) => {
      const element = event.target as HTMLElement;

      if (element.dataset.cy !== 'TodoTitleField') {
        setTodoState({ ...todoState, isEdited: false });
      }
    };

    document.addEventListener('click', cleanInputFocus);

    return () => {
      document.removeEventListener('click', cleanInputFocus);
    };
  }, [todoState]);

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      isLoading.current = true;
      deleteTodo(id)
        .then(() => {
          setTodos(todos.filter(task => task.id !== id));
        })
        .catch(() => callError(setError, 'delete'));
    },
    [id, todos, setError, setTodos],
  );

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${todoState.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todoState.completed}
          onClick={() =>
            setTodoState({ ...todoState, completed: !todoState.completed })
          }
        />
      </label>

      {todoState.isEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoState.editedValue}
            onChange={e =>
              setTodoState({ ...todoState, editedValue: e.target.value })
            }
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setTodoState({ ...todoState, isEdited: true })}
        >
          {todoState.editedValue}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading.current,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
