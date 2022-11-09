/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  hasError: Error;
  handleErrorClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  handleErrorClose,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError.status },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={handleErrorClose}
    />
    {hasError.message}
  </div>
);
