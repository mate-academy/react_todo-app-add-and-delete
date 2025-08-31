import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
  handleHideError: () => void;
};
export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger',
        'is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {errorMessage}
    </div>
  );
};
