import React from 'react';
import classNames from 'classnames';

type Props = {
  isHidden: boolean;
  setIsHidden: (value: boolean) => void;
  errorMessage: string;
};

export const Errors: React.FC<Props> = ({
  isHidden, setIsHidden, errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          'hidden ': isHidden,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
