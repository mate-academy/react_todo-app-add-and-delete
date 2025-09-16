import classNames from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  errorMessage: Errors;
  setErrorMessage: (error: Errors) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.Empty)}
      />
      {errorMessage}
    </div>
  );
};
