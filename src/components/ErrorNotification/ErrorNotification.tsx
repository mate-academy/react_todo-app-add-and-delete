import React from 'react';
import clsx from 'clsx';

type Props = {
  anyExistingError: boolean;
  clearError: () => void;
  loadingError: {
    todosError: boolean;
    queryError: boolean;
    addError: boolean;
    deleteError: boolean;
    updateError: boolean;
  };
};
export const ErrorNotification: React.FC<Props> = ({
  anyExistingError,
  clearError,
  loadingError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={clsx(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !anyExistingError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={clsx('delete')}
        onClick={clearError}
      />
      {loadingError.todosError && (
        <>
          Unable to load todos
          <br />
        </>
      )}
      {loadingError.queryError && (
        <>
          Title should not be empty
          <br />
        </>
      )}
      {loadingError.addError && (
        <>
          Unable to add a todo
          <br />
        </>
      )}
      {loadingError.deleteError && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}
      {loadingError.updateError && 'Unable to update a todo'}
    </div>
  );
};
