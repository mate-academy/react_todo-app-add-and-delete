import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  visible: boolean,
  message: string,
  onClear: () => void,
};

export const Notification: React.FC<Props> = ({
  visible,
  message,
  onClear,
}) => {
  useEffect(() => {
    setInterval(onClear, 3000);
  }, [message]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !visible },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={onClear}
      />
      {message}
    </div>
  );
};
