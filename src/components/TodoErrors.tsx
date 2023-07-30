import { useEffect } from 'react';
import classNames from 'classnames';
import { TodoError } from '../types/TodoError';

type Props = {
  errorMessage: TodoError;
  handleErrorMessage: (errorMessage: TodoError) => void;
};

export const TodoErrors: React.FC<Props> = ({
  errorMessage,
  handleErrorMessage,
}) => {
  const handleCloseError = () => handleErrorMessage(TodoError.none);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        handleCloseError();
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hiden: errorMessage === TodoError.none },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
      />

      {errorMessage}
    </div>
  );
};
