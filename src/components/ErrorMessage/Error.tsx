import React, { memo, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  onCloseError: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorMessage: React.FC<Props> = memo((props) => {
  const { error, onCloseError } = props;

  useEffect(() => {
    setTimeout(() => {
      onCloseError('');
    }, 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseError('')}
      />
      {error}
    </div>
  );
});
