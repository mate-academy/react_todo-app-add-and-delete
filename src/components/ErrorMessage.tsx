import classNames from 'classnames';
import React from 'react';

interface Props {
  isHidden: boolean;
  errorMessage: string;
  setIsHidden: (value: boolean) => void;
}

export const ErrorMessage: React.FC<Props> = ({
  isHidden,
  errorMessage,
  setIsHidden,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
