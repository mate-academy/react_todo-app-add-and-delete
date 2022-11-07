import classNames from 'classnames';
import React from 'react';
import { ErrorsType } from '../../types/ErrorsType';

type Props = {
  error: ErrorsType,
  clearErrors: () => void,
};

export const Errors:React.FC<Props> = ({
  clearErrors,
  error,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === ErrorsType.NONE },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrors}
      />

      {error === ErrorsType.ISEMPTY && (
        'Title can\'t be empty'
      )}

      {error === ErrorsType.ADD && (
        'Unable to add a todo'
      )}

      {error === ErrorsType.DELETE && (
        'Unable to delete a todo'
      )}
    </div>
  );
};
