/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';

type Props = {
  todosError: string,
};

export const TodoappError: React.FC<Props> = ({
  todosError,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(`notification is-danger is-light has-text-weight-normal ${isHidden && 'hidden'}`)}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setIsHidden(true);
        }}
      />
      {todosError}
    </div>
  );
};
