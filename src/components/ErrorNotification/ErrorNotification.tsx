import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  handleErrorRemove: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleErrorRemove,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorRemove}
      />
      {errorMessage}
    </div>
  );
};
