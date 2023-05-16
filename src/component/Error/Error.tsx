/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

interface Props {
  isError: boolean,
  titleError: string,
  closeError: () => void,
}

export const Error: React.FC<Props> = ({
  isError,
  titleError,
  closeError,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
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
