import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorText: string,
  setErrorText: (value: string) => void,
  hasError: boolean,
};

export const TodoErrors: React.FC<Props> = ({
  errorText, setErrorText, hasError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorText('');
    }, 3000);
  }, [hasError]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !hasError },
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
