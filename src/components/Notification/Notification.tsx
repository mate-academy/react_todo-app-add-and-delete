import React from 'react';
import classNames from 'classnames';

type Props = {
  setShowError: (error: null | Error) => void;
  ShowError: null | Error;
  isEmptyTitle: boolean;
  isUnableToAdd: boolean;
  isUnableToRemove: boolean;
};

export const Notification: React.FC<Props> = React.memo(({
  setShowError,
  ShowError,
  isEmptyTitle,
  isUnableToAdd,
}) => {
  const errorTitle = 'Title can\'t be empty';
  const erorrAdd = 'Unable to add a todo';
  const erorrRemove = ' Unable to delete a todo';

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: (!ShowError) },
    )}
    >
      <button
        type="button"
        className="delete hidden"
        id="delete"
        onClick={() => setShowError(null)}
      >
        Delete
      </button>

      {isEmptyTitle && errorTitle}
      {isUnableToAdd && erorrAdd}
      {isUnableToAdd && erorrRemove}
      {/* Unable to update a todo */}
    </div>
  );
});
