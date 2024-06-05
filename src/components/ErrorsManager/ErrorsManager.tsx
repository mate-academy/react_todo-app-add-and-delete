import { FC } from 'react';
import { Errors } from '../../App';
import classNames from 'classnames';

interface Props {
  error: Errors;
  errorHide: () => void;
}

export const ErrorsManager: FC<Props> = ({ error, errorHide }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === Errors.default,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        title="Hide Error"
        onClick={errorHide}
      ></button>
      {error !== Errors.default && error}
    </div>
  );
};
