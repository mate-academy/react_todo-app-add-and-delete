import cn from 'classnames';
import { ErrorTypes } from '../types/enums';
import { handleError } from '../utils/services';

type Props = {
  errorMessage: ErrorTypes;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === ErrorTypes.def,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleError(ErrorTypes.def, setErrorMessage)}
      />
      {errorMessage}
    </div>
  );
};
