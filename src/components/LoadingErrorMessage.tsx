import classNames from 'classnames';
import { useEffect } from 'react';

export enum ErrorTypes {
  None,
  LoadingAllError
  = 'Unable to load a list of todos. Check if your link is correct',
  AddingTitleError = 'Title can not be empty',
  AddingTodoError = 'Unable to add a todo',
  DeletingOneError = 'Unable to delete a todo',
}

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  setErrorType: (err: ErrorTypes) => void;
  errorType: string;
};

export const ErrorMessage: React.FC<Props> = ({
  closeError,
  error,
  setErrorType,
  errorType,
}) => {
  const handleWindowClose = () => {
    closeError(true);
    setErrorType(ErrorTypes.None);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      closeError(true);
      setErrorType(ErrorTypes.None);
    }, 3000);

    clearTimeout(timer);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error },
      )}
    >
      <button
        aria-label="Hide Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleWindowClose}
      />
      {errorType}
    </div>
  );
};
