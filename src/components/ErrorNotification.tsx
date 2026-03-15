import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errMsg: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ errMsg, onClose }) => {
  useEffect(() => {
    if (!errMsg) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errMsg, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errMsg },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errMsg}
    </div>
  );
};
