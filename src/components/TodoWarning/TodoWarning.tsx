import React from 'react';
import cn from 'classnames';

interface Props {
  isError: boolean,
  setIsError: (param: boolean) => void
  errorMessage: string;
}

export const TodoWarning: React.FC<Props> = ({
  isError,
  setIsError,
  errorMessage,
}) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        aria-label="close button"
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />

      {errorMessage}
    </div>
  );
};
