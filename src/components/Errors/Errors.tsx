import classNames from 'classnames';
import React from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  setErrors: (value: ErrorType) => void;
  errors: ErrorType,
};

export const Errors: React.FC<Props> = ({
  setErrors,
  errors,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      {
        hidden: errors === ErrorType.NONE,
      },
    )}
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrors(ErrorType.NONE)}
      />
    }

    {errors === ErrorType.ADD && (
      'Unable to add a todo'
    )}
    <br />
    {errors === ErrorType.DELETE && (
      'Unable to delete a todo'
    )}
    <br />
    {errors === ErrorType.UPDATE && (
      'Unable to update a todo'
    )}
    {errors === ErrorType.EMPTYTITLE && (
      'Title can\'t be empty'
    )}
  </div>
);
