import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../stores/TodosContext';
import { ErrorMessages } from '../types/ErrorMessages';

export const ErrorNotification: React.FC = () => {
  const {
    hasErrors,
    setHasErrors,
    errorText,
    setErrorText,
  } = useContext(TodosContext);

  const handleCloseClick = () => {
    setTimeout(() => {
      setErrorText(ErrorMessages.None);
    }, 3000);
    setHasErrors(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        's-light',
        'has-text-weight-normal', {
          hidden: !hasErrors,
        },
      )}
    >
      <button
        aria-label="Hide notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseClick}
      />
      {errorText}
    </div>
  );
};
