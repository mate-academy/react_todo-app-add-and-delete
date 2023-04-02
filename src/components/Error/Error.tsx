/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  removeMessage: () => void,
};

export const Error: React.FC<Props> = (
  { errorMessage, removeMessage },
) => {
  const isError = errorMessage !== '';

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isError },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={removeMessage}
      />
      {errorMessage}
    </div>
  );
};
