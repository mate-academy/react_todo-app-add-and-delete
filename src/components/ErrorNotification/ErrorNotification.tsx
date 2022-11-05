/* eslint-disable jsx-a11y/control-has-associated-label */
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage,
  onClose: () => void,
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={error === ErrorMessage.none}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {error}
    </div>
  );
};
