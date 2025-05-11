import classnames from 'classnames';
import { useEffect } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: string;
  setErrorMessage: (error: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { errorMessage, setErrorMessage } = props;

  useEffect(() => {
    if (errorMessage === ErrorMessage.Default) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage(ErrorMessage.Default);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification',
        'is-danger',
        'is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.Default)}
      />
      {errorMessage}
    </div>
  );
};
