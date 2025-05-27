import React from 'react';
import { ErrorType } from '../App';

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
      className={`notification is-danger is-light has-text-weight-normal ${!currentError ? 'hidden' : ''}`}
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
