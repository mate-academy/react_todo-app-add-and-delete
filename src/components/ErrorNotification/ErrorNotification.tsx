/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: { hasError: boolean; hasMessage: string };
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
          hidden: !errorMessage.hasError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage({
          hasError: false,
          hasMessage: '',
        })}
      />
      {errorMessage.hasMessage}
    </div>
  );
};
