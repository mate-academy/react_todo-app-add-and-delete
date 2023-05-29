/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  typeError: string,
  setTypeError: React.Dispatch<React.SetStateAction<ErrorTypes>>,
};

export const ErrorMessages: React.FC<Props> = ({ typeError, setTypeError }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => (setTypeError(ErrorTypes.default))}
      />

      {typeError}
      <br />
    </div>
  );
};
