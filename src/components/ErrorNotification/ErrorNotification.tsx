import cn from 'classnames';
import React from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType | null;
};

export const ErrorNotification: React.FC<Props> = ({ error }) => {
  return (
    <>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />
          {error}
      </div>
    </>
  );
};
