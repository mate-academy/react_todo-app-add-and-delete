/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todosError: string,
  setTodosError: (string: string) => void;
};

export const TodoappError: React.FC<Props> = ({
  todosError,
  setTodosError,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setTodosError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        {
          hidden: !todosError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setTodosError('');
        }}
      />
      {todosError}
    </div>
  );
};
