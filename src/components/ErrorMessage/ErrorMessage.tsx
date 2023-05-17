import classNames from 'classnames';
import { useEffect } from 'react';

interface Props {
  error: string;
  onCloseError: () => void;
}

export const Error: React.FC<Props> = ({
  error,
  onCloseError,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onCloseError();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <div className={classNames(
      'notification', 'is-danger', 'is-light',
      'has-text-weight-normal', {
        hidden: !error,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {error}
    </div>
  );
};
