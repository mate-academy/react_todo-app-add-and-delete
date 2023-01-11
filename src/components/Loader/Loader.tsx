import { FunctionComponent } from 'react';
import classnames from 'classnames';

interface LoaderProps {
  isLoading: boolean,
}

export const Loader: FunctionComponent<LoaderProps> = ({
  isLoading,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classnames(
        'modal overlay', {
          'is-active': isLoading,
        },
      )}
    >

      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
