import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { DispatchContext } from './MainContext';
import { deleteTodo } from '../api/todos';
import { ActionTypes } from '../types/ActionTypes';
import { TodoLoader } from './TodoLoader';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const { id, title, completed } = todo;

  const handleDeleteTodo = (idNumber: number) => {
    deleteTodo(idNumber)
      .then(() => {
        dispatch({
          type: ActionTypes.DeleteTodo,
          payload: id,
        });
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.SetValuesByKeys,
          payload: {
            errorMessage: 'Unable to delete a todo',
          },
        });
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {id === 0 && <TodoLoader />}
    </div>
  );
};
