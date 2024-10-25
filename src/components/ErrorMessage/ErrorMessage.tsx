import classNames from 'classnames';
import { useEffect } from 'react';

interface Props {
  errorMessage: string;
  isHidden: boolean;
  setIsHidden: (boolean: boolean) => void;
  setErrorMessage: (string: string) => void;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  isHidden,
  setIsHidden,
  setErrorMessage,
}) => {
  const handleClose = () => {
    setIsHidden(true);
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage) {
      setIsHidden(false);

      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, isHidden]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        isHidden && 'hidden',
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {errorMessage}
    </div>
  );
};
