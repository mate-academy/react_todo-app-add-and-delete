import classNames from 'classnames';
import { StatesContext } from '../context/Store';
import { useContext } from 'react';

export const TodoLoader: React.FC = () => {
  const { isUpdating } = useContext(StatesContext);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        ['is-active']: isUpdating,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
