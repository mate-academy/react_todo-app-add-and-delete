import classNames from 'classnames';
import { useEffect } from 'react';

interface Props {
  errorMessage: string,
  setErrorMessage: (message: string) => void,
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: errorMessage === '' },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
        aria-label="closeBtn"
      />
      {errorMessage}
    </div>
  );
};
