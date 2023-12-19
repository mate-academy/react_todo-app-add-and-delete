import { ErrorSpec } from '../../types/ErrorSpec';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

type Props = {
  error: ErrorSpec | null;
  closeError: () => void;
};

export const Errors: React.FC<Props> = ({ error, closeError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="none"
        onClick={closeError}
      />

      {error && (<ErrorMessage error={error} />)}
    </div>
  );
};
