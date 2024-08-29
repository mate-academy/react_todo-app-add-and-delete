import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type LoaderProps = {
  todo: Todo;
  loading: number[];
};

export const Loader: React.FC<LoaderProps> = ({ todo, loading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loading.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
