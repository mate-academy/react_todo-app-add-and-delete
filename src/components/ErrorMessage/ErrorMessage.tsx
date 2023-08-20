/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';
import { ErrorContext } from '../../utils/ErrorContextProvider';

interface Props {
  error: Errors | '',
  isVisible: boolean,
}

export const ErrorMessage: React.FC<Props> = ({
  error,
  isVisible,
}) => {
  const { setErrorVisibility } = useContext(ErrorContext);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isVisible },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorVisibility(false)}
      />

      {error}
    </div>
  );
};
