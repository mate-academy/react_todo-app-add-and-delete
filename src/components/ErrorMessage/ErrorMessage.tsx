import { FC, useEffect } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (Value: string) => void;
};

export const ErrorMessage: FC<Props> = ({ errorMessage, setErrorMessage }) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (errorMessage.length > 0) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage.length === 0 && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
      <br />
      {/* Unable to delete a todo */}
    </div>
  );
};
