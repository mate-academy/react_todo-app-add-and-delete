import React from 'react';
import { ErrorType } from '../App';
import classNames from 'classnames';

type Props = {
  currentError: string;
  setCurrentError: React.Dispatch<React.SetStateAction<'' | ErrorType>>;
};

export const ErrorNotification: React.FC<Props> = ({
  currentError,
  setCurrentError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !currentError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setCurrentError('')}
      />
      {currentError}
    </div>
  );
};
