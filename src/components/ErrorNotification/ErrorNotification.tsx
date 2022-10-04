import classnames from 'classnames';
import { useEffect } from 'react';
import { Error } from '../../types/Error';

type Props = {
  errorText: Error;
  handleErrorChange: (error: Error | null) => void;
  setIsAdding: (value: boolean) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorText,
  handleErrorChange,
  setIsAdding,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleErrorChange(null);
      setIsAdding(false);
    }, 3000);

    return (() => {
      clearTimeout(timeout);
    });
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorText },
      )}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleErrorChange(null)}
      />

      {errorText}
    </div>
  );
};
