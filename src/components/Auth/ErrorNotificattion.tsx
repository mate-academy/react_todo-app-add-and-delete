import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorMessage: string,
  setErrorMessage: (param: string) => void;

};

export const ErroNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [hiddenError, setHiddenError] = useState(false);

  useEffect(() => {
    const showMessage = setTimeout(() => {
      setErrorMessage('');
      if (hiddenError) {
        clearInterval(showMessage);
      }
    }, 3000);
  }, [errorMessage]);

  const handleError = () => {
    setHiddenError(prev => !prev);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: hiddenError,
          },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="a problem"
        onClick={handleError}

      />

      {errorMessage}
    </div>
  );
};
