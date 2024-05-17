import { FC } from 'react';
import classNames from 'classnames';

type TProps = {
  errorMessage: string;
  showError: (err: string) => void;
};

export const ErrorsTodo: FC<TProps> = ({ errorMessage, showError }) => {
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
        onClick={() => showError('')}
      />

      <p>{errorMessage}</p>
    </div>
  );
};
