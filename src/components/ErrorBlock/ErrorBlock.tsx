import { FC } from 'react';
import classNames from 'classnames';
import { CustomError } from '../../types/CustomError';

type Props = {
  error: CustomError,
  onErrorClose: () => void,
};

export const ErrorBlock: FC<Props> = ({ error, onErrorClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error.active },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error"
        onClick={onErrorClose}
      />
      {error.messages}
    </div>
  );
};
