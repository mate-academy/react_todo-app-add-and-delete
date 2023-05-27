import { FC } from 'react';
import { Errors } from '../../utils/enums';

interface Props {
  onChangeError: (error: Errors | null) => void;
  error: Errors;
}

export const ErrorNotification:FC<Props> = ({
  onChangeError,
  error,
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
    {error}
  </div>
);
