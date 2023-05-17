/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { Errors } from '../../utils/enums';

interface Props {
  setHasError: (error: Errors | null) => void;
  hasError: Errors
}

export const ErrorNotification:FC<Props> = ({
  setHasError,
  hasError,
}) => {
  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHasError(null)}
      />
      {hasError === Errors.Url && (
        <p>{Errors.Url}</p>
      )}

      {hasError === Errors.Title && (
        <p>{Errors.Title}</p>
      )}

      {hasError === Errors.Add && (
        <p>{Errors.Add}</p>
      )}

      {hasError === Errors.Url && (
        <p>{Errors.Delete}</p>
      )}
    </div>
  );
};
