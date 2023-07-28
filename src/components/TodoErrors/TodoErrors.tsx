import classNames from 'classnames';
import { useEffect } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  error: string,
  clearError: () => void,
}

export const TodoErrors: React.FC<Props> = ({
  error,
  clearError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      clearError();
    }, 3000);
  }, [error]);

  return (
    <div
      // eslint-disable-next-line max-len
      className={classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={clearError}
      />
      {error}
    </div>
  );
};
