import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  errorType: string;
};

export const ErrorNotification: React.FC<Props> = ({
  errorType,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const emptyTitleMessage = 'Title can\'t be empty';
  const errorMessage = errorType !== 'empty title'
    ? `Unable to ${errorType} a todo`
    : emptyTitleMessage;

  useEffect(() => {
    const removeNotification = () => {
      window.setTimeout(() => {
        setIsHidden(true);
      }, 3000);
    };

    if (errorType) {
      setIsHidden(false);
      removeNotification();
    } else {
      setIsHidden(true);
    }
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: isHidden,
        },
      )}
    >
      <button
        aria-label="delete"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
