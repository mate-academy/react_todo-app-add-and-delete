import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMsg: string;
  changeError: (er: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMsg,
  changeError,
}) => {
  useEffect(() => {
    if (!errorMsg) {
      return;
    }

    const timer = setTimeout(() => {
      changeError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMsg, changeError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMsg.length },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => changeError('')}
      />
      {errorMsg}
    </div>
  );
};
