import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMsg: string | null;
};

export const Error: React.FC<Props> = ({ errorMsg }) => {
  return (
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
