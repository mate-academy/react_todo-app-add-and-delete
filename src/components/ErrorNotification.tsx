import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  isError: boolean;
  errorType: string;
  onError: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  onError,
  errorType,
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const emptyTitleNotification = 'Title can\'t be empty';
  const errorMessage = errorType !== 'empty title'
    ? `Unable to ${errorType} a todo`
    : emptyTitleNotification;

  useEffect(() => {
    const removeNotification = () => {
      window.setTimeout(() => {
        setIsHidden(true);
        onError(false);
      }, 3000);
    };

    if (isError) {
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
        type="button"
        aria-label="delete button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
