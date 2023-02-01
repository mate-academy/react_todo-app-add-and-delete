import React, { memo, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorText: string;
  onChangeErrorText: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = memo(({
  errorText,
  onChangeErrorText,
}) => {
  useEffect(() => {
    setTimeout(() => onChangeErrorText(''), 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !errorText })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onChangeErrorText('')}
      />
      {errorText}
    </div>
  );
});
