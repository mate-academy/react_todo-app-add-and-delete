import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  currentError: ErrorType,
  setCurrentError: Dispatch<SetStateAction<ErrorType>>,
};

export const TodoNotification: React.FC<Props> = ({
  currentError,
  setCurrentError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !currentError },
      )}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setCurrentError(ErrorType.NoError)}
      />
      {currentError}
    </div>
  );
};
