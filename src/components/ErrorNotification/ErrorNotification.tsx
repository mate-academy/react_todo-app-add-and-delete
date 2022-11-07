import React from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  error,
  onClose,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: error === ErrorType.NONE },
    )}
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />

    {error === ErrorType.EMPTYTITLE && (
      'Title can\'t be empty'
    )}

    {error === ErrorType.ADD && (
      'Unable to add a todo'
    )}

    {error === ErrorType.DELETE && (
      'Unable to delete a todo'
    )}

    {error === ErrorType.UPDATE && (
      'Unable to update a todo'
    )}
  </div>
));
