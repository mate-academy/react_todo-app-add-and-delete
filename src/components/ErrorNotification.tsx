/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorType } from '../utils/enums';

type Props = {
  error: ErrorType | null,
  onError(type: ErrorType | null): void,
};

export const ErrorNotification: React.FC<Props> = ({ error, onError }) => {
  useEffect(() => {
    setTimeout(() => onError(null), 3000);
  }, [onError]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !error,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onError(null)}
      />
      {error === ErrorType.Get && 'Unable to load a todo'}
      {error === ErrorType.Post && 'Unable to add a todo'}
      {error === ErrorType.Delete && 'Unable to delete a todo'}
      {error === ErrorType.Patch && 'Unable to update a todo'}
      {error === ErrorType.isEmpty && 'Title can\'t be empty'}
    </div>
  );
};
