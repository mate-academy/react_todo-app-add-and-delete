/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTodos } from '../hooks/useTodos';

export const ErrorNotification: React.FC = () => {
  const { errorMessage } = useTodos();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setIsHidden(!!errorMessage);

    setTimeout(() => setIsHidden(false), 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(false)}
      />
      {errorMessage}
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
