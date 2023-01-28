import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  isHidden: boolean;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
  error: string;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorNotification: React.FC<Props> = ({
  isHidden,
  setIsHidden,
  error,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={isHidden}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error}
    </div>
  );
};
