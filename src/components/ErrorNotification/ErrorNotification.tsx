/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { CurrentError } from '../../types/CurrentError';

type Props = {
  errorMessage: CurrentError,
  hideErros: () => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  hideErros,
}) => {
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
        onClick={hideErros}
      />
      {errorMessage}
    </div>
  );
};
