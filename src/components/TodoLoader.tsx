import classNames from 'classnames';
import { StatesContext } from '../context/Store';
import { useContext } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoLoader: React.FC<Props> = ({ todo }) => {
  const { isUpdating, selectedTodo, tempTodo } = useContext(StatesContext);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        ['is-active']:
          (isUpdating && selectedTodo === todo.id) ||
          (tempTodo && todo.id === 0),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
