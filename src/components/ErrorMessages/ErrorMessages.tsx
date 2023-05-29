/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  typeError: string,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ErrorMessages: React.FC<Props> = ({ typeError, setHasError }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => (setHasError(false))}
      />

      {/* show only one message at a time */}
      {typeError}
      <br />
    </div>
  );
};
