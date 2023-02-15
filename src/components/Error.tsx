/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (errorMessage: string) => void,
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div className={classNames('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
