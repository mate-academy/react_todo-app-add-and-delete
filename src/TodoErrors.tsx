import classNames from 'classnames';
import React from 'react';

type Props = {
  errorText: string,
  setErrorText: (value: string) => void,
};

export const TodoErrors: React.FC<Props> = ({ errorText, setErrorText }) => {
  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorText },
    )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorText('')}
      />
      {errorText}
    </div>
  );
};
