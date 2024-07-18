import { useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  loadingError: boolean;
  titleError: boolean;
  todoAddError: boolean;
  deleteError: boolean;
  handleDeleteAllErrors: () => void;
};

export const ErrorMessage: React.FC<Props> = ({
  loadingError,
  titleError,
  todoAddError,
  deleteError,
  handleDeleteAllErrors,
}) => {
  const timerId = useRef(0);

  const isHidden =
    !loadingError && !titleError && !todoAddError && !deleteError;

  useEffect(() => {
    timerId.current = window.setTimeout(() => {
      handleDeleteAllErrors();
    }, 3000);

    return () => {
      window.clearTimeout(timerId.current);
    };
  });

  const handleCloseNotification = () => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    handleDeleteAllErrors();
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close notification"
        onClick={handleCloseNotification}
      />
      {loadingError && 'Unable to load todos'}
      {titleError && 'Title should not be empty'}
      {todoAddError && 'Unable to add a todo'}
      {deleteError && 'Unable to delete a todo'}
      {/* Unable to update a todo */}
    </div>
  );
};
