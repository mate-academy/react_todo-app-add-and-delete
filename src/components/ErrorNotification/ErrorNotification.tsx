import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: { hasMessage: string };
  setErrorMessage: (arg0: Error) => void;
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
        {
          hidden: !errorMessage.hasMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage({
          hasMessage: '',
        })}
        aria-label="Hide error notification"
      />
      {errorMessage.hasMessage}
    </div>
  );
};
