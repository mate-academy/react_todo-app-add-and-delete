/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import classNames from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  errorText: Errors | null;
  addErrorText: (errorMessage: Errors | null) => void;
};

export const TodoError: React.FC<Props> = ({ errorText, addErrorText }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorText },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => addErrorText(null)}
      />
      {errorText}
    </div>
  );
};
