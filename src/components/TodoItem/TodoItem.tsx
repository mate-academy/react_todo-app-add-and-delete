import { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodoContext } from '../TodoContext';
import { ErrorContext } from '../ErrorContext';

type Props = {
  todo: Todo;
  loader: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, loader }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const { setError } = useContext(ErrorContext);
  const { setTodos } = useContext(TodoContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        return setTodos(prevState => prevState
          .filter(pTodo => pTodo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div
        className={classNames('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          onClick={handleDeleteClick}
        >
          ×
        </button>

        <div className={classNames('modal', 'overlay', {
          'is-active': isLoading || loader,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
/* This todo is in loadind state */
/* <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">Todo is being saved now</span>
      <button type="button" className="todo__remove">×</button> */

/* 'is-active' class puts this modal on top of the todo */
/* <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */
/* </div> */
