import classNames from 'classnames';
import { FC } from 'react';
import { Error } from '../../types/Error';
import { Props } from './ErrorNotification.props';

export const ErrorNotification:FC<Props> = ({ error, setError }) => {
  if (error) {
    setTimeout(() => {
      setError(Error.No);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="Hide Error Button"
        className="delete"
        onClick={() => setError(Error.No)}
      />
      {error}
    </div>
  );
};
