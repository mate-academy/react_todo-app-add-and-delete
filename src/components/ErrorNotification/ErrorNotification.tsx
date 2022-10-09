import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage | null,
  isError: boolean,
  setIsError: (value: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isError,
  setIsError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={() => setIsError(false)}
      />

      {errorMessage}
    </div>
  );
};
