/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

interface Props {
  titleError: string,
  closeError: () => void,
}

export const Error: React.FC<Props> = ({
  titleError,
  closeError,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !titleError,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeError}
      />
      {titleError}
    </div>
  );
};
