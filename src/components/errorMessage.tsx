import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMsg: string | null;
};

export const Error: React.FC<Props> = ({ errorMsg }) => {
  return (
    /* DON'T use conditional rendering to hide the notification */
    /* Add the 'hidden' class to hide the message smoothly */
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMsg === null },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMsg && errorMsg}
    </div>
  );
};
