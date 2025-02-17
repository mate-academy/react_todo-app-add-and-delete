import React from 'react';

type Props = {
  errorMessage: string;
  onClose: (message: string) => void;
};

export const Errors: React.FC<Props> = ({ errorMessage, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={`delete ${!errorMessage && 'hidden'}`}
        onClick={() => onClose('')}
      />
      {errorMessage}
    </div>
  );
};
