import {
  Dispatch,
  useEffect,
  useState,
  SetStateAction,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todosIdToDelete: number[];
  setTodosIdToDelete: Dispatch<SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todosIdToDelete,
  setTodosIdToDelete,
}) => {
  const [markLoading, setMarkLoading] = useState(false);

  useEffect(() => {
    if (todosIdToDelete.includes(todo.id)) {
      setMarkLoading(true);
    } else {
      setMarkLoading(false);
    }
  }, [todosIdToDelete]);

  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => setTodosIdToDelete((curent) => [...curent, todo.id])}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': markLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="Loader">
          <div className="Loader__content" />
        </div>
      </div>
    </div>
  );
};
