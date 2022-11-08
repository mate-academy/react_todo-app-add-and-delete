import React from 'react';
import cn from 'classnames';

type Props = {
  isError: boolean;
  onClose: () => void;
};

export const ErrorMessage: React.FC<Props> = React.memo(({
  isError, onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        aria-label="Close error messages"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo
    </div>
  );
});
