import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  loadingState: boolean;
  todo: Todo;
  activeTodo: Todo | null;
};

export const Loader: React.FC<Props> = ({ loadingState, todo, activeTodo }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingState && todo.id === activeTodo?.id,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
