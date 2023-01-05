import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  onClick: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const { error, onClick } = props;

  useEffect(() => {
    setTimeout(() => {
      onClick('');
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
        onClick={() => onClick('')}
      />
      {error}
    </div>
  );
};
