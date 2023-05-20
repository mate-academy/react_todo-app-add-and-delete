import { FC } from 'react';
import { Errors } from '../../utils/enums';

interface Props {
  onChangeError: (error: Errors | null) => void;
  hasError: Errors
}

export const ErrorNotification:FC<Props> = ({
  onChangeError,
  hasError,
}) => (
  <div
    className="notification is-danger is-light has-text-weight-normal"
  >
    <button
      aria-label="delete"
      type="button"
      className="delete"
      onClick={() => onChangeError(null)}
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

    {hasError === Errors.Delete && (
      <p>{Errors.Delete}</p>
    )}

    {hasError === Errors.Update && (
      <p>{Errors.Update}</p>
    )}
  </div>
);
