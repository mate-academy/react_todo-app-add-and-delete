/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todosError: string,
  hiddenClass: boolean,
  onSetHiddenClass: (value: boolean) => void,
};

export const Error: React.FC<Props> = ({
  todosError,
  hiddenClass,
  onSetHiddenClass,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSetHiddenClass(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onSetHiddenClass]);

  return (
    <div
      data-cy="ErrorNotification"
      // className="notification is-danger is-light has-text-weight-normal"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: hiddenClass,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onSetHiddenClass(true);
        }}
      />
      {todosError}
      {/* show only one message at a time */}
      {/* Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
