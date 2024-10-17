import { FC } from 'react';
import cn from 'classnames';

import { Errors } from '../../types/Errors';
import { handleError } from '../../utils/handleError';

interface Props {
  error: Errors;
  setError: (error: Errors) => void;
}

export const ErrorMessage: FC<Props> = ({ error, setError }) => {
  const handleClose = () => {
    handleError(Errors.DEFAULT, setError);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {error}
    </div>
  );
};
