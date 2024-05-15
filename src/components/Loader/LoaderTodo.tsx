import classNames from 'classnames';
import { FC } from 'react';
interface IProps {
  loading: boolean;
}

export const LoaderTodo: FC<IProps> = ({ loading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': loading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
