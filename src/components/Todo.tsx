import classNames from 'classnames';
import { useState } from 'react';
import { remove } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  completed: boolean,
  title: string;
  id: number;
  setError: any
  setTodos: any
  todos: Todo[],
  isLoading: boolean,
}

export const TodoInfo: React.FC<Props> = ({
  completed,
  title,
  id,
  setTodos,
  setError,
  todos,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);

  const handlerClick = (removeId: number) => {
    setSelectedTodoId(removeId);
    const fetchData = async () => {
      try {
        await remove(removeId);

        setTodos([...todos.filter(todoo => todoo.id !== removeId)]);
      } catch (errorFromServer) {
        setError('Unable to delete a todo');
      }
    };

    fetchData();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handlerClick(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'is-active': selectedTodoId === id,
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
