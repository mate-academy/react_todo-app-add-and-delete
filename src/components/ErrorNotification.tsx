import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMsg: string;
  onErrorDelete?: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorMsg,
  onErrorDelete = () => { },
}) => {
  useEffect(() => {
    const timeoutID = setTimeout(onErrorDelete, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [onErrorDelete]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMsg,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={onErrorDelete}
      />
      {errorMsg}
    </div>
  );
});
