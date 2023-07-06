/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string | null;
  setErrorMessage: (value: React.SetStateAction<string | null>) => void;
}

export const TodoError: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
