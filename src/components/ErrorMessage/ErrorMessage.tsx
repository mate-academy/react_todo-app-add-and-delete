import React from 'react';
import cn from 'classnames';

interface Props {
  children: string;
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ErrorMessage: React.FC<Props> = ({
  children,
  isHidden,
  setIsHidden,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide errors"
        onClick={() => {
          setIsHidden(true);
        }}
      />

      <p>{children}</p>
    </div>
  );
};
