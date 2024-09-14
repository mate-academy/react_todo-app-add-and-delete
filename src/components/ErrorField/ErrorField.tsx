import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage | null;
  onSetErrorMessage: (message: ErrorMessage | null) => void;
};

export const ErrorField: React.FC<Props> = ({
  errorMessage,
  onSetErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => onSetErrorMessage(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, onSetErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
