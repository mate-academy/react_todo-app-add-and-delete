import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  error: string,
  onChange: (value: string) => void,
};

export const ErrorNotification: React.FC<Props> = memo((props) => {
  const { error, onChange } = props;

  setTimeout(() => onChange, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      // className="notification is-danger is-light has-text-weight-normal"
      className={cn(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onChange('')}
      />
      {error}
    </div>
  );
});
