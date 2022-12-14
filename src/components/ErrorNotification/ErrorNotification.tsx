import React, { useEffect } from 'react';

interface Props {
  isError: boolean,
  errorText: string,
  onSetIsError: (isError: boolean) => void,
}
export const ErrorNotification: React.FC<Props> = React.memo(({
  isError,
  onSetIsError,
  errorText,
}) => {
  let timer: NodeJS.Timer;

  useEffect(() => {
    if (isError) {
      timer = setTimeout(() => onSetIsError(false), 3000);
    }
  }, [isError]);

  return (
    <div
      hidden={!isError}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onSetIsError(false);
          clearTimeout(timer);
        }}
      />
      {errorText}
    </div>
  );
});
