import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  setErrorMessage: (e: ErrorMessage) => void;
};

export const ErrorNotification = ({ errorMessage, setErrorMessage }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
