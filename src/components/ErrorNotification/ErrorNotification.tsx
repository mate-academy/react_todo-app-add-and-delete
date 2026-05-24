import classNames from 'classnames';
import { Errors } from '../../types/ErrorType';

interface Props {
  errorMessage: Errors | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors | null>>;
}

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
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
