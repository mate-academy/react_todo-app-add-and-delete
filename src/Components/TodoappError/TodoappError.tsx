/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todosError: string,
  onSetIsHidden: (value: boolean) => void,
  isHidden: boolean,
};

export const TodoappError: React.FC<Props> = ({
  todosError,
  onSetIsHidden,
  isHidden,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSetIsHidden(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onSetIsHidden]);

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
          onSetIsHidden(true);
        }}
      />
      {todosError}
    </div>
  );
};
