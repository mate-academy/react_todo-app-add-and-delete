import { ErrorMessage } from '../types/ErrorMessage';

interface PropsError {
  message: ErrorMessage | '';
  onClear: () => void;
}

export const ErrorNotification: React.FC<PropsError> = ({
  message,
  onClear,
}) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${message ? '' : 'hidden'}`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClear}
    />
    {message}
  </div>
);
