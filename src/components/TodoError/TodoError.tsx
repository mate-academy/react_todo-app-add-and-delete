import React from 'react';
import cn from 'classnames';

type Props = {
  error: string | null,
  onCloseError: () => void,
};

export const TodoError: React.FC<Props> = React.memo(({
  error,
  onCloseError,
}) => {
  return (
    <div className={cn(`
        notification is-danger
        is-light has-text-weight-normal`, {
      hidden: !error,
    })}
    >
      <button
        aria-label="closeErrorButton"
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {error}
    </div>
  );
});
