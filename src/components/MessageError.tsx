import classNames from 'classnames';
import React from 'react';

type Props = {
  theError: string;
  hasError: boolean;
  setHasError: (p: boolean) => void;
};

export const MessageError: React.FC<Props> = ({
  theError,
  hasError,
  setHasError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !hasError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />

      {theError}
    </div>
  );
};
