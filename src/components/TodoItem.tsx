/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { selectedTodo } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [isEditing]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'startUpdate' });
    if (todo) {
      dispatch({
        type: 'updateTodo',
        payload: { ...todo, completed: e.target.checked },
      });
      updateTodo(todo.id, {
        ...todo,
        completed: e.target.checked,
      })
        .catch(() => {
          dispatch({
            type: 'showError',
            payload: 'Unable to update a todo',
          });
        })
        .finally(() => {
          dispatch({ type: 'stopUpdate' });
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { ['completed']: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={e => handleOnChange(e)}
        />
      </label>

      {isEditing && selectedTodo === todo.id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
            ref={inputRef}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              dispatch({ type: 'selectTodo', payload: todo.id });
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              dispatch({ type: 'startUpdate' });
              dispatch({ type: 'selectTodo', payload: todo.id });
              deleteTodo(todo.id)
                .then(() => {
                  dispatch({ type: 'deleteTodo', payload: todo.id });
                })
                .catch(() => {
                  dispatch({
                    type: 'showError',
                    payload: 'Unable to delete a todo',
                  });
                })
                .finally(() => dispatch({ type: 'stopUpdate' }));
            }}
          >
            ×
          </button>
        </>
      )}
      <TodoLoader todo={todo} />
    </div>
  );
};
