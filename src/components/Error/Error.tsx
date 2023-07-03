import { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  isError: ErrorMessage,
  handleCloseError: () => void,
};

export const Error: React.FC<Props> = ({
  isError,
  handleCloseError,
  // setIsLoading,
}) => {
  useEffect(() => {
    const delay = setTimeout(() => {
      handleCloseError();
    }, 3000);

    return () => {
      clearTimeout(delay);
    };
  }, [handleCloseError]);

  return (
    <div
      className={(cn(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal', {
          hidden: !isError,
        },
      ))}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete"
        onClick={handleCloseError}
      />
      {isError}
    </div>
  );
};
