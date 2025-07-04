import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string | null;
  onClose: () => void;
};

export const Error: React.FC<Props> = ({ errorMessage, onClose }) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
