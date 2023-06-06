/* eslint-disable jsx-a11y/control-has-associated-label */

import { Errors } from '../types/Errors';

interface Props {
  handleSetError: (value: Errors) => void,
  errorType: Errors
}

export default function ErrorMessage({ handleSetError, errorType }: Props) {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => handleSetError('')}
      />
      {errorType}
    </div>
  );
}
