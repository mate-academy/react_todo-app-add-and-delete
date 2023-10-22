/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string;
  removeErrorMessage: () => void;
}

export const Notification: React.FC<Props> = ({
  errorMessage,
  removeErrorMessage = () => {},
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={removeErrorMessage}
        />

        {errorMessage}
      </div>
    </>
  );
};
