import React, { memo, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onChangeErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorMessage: React.FC<Props> = memo(({
  errorMessage,
  onChangeErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => onChangeErrorMessage(''), 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onChangeErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
});
