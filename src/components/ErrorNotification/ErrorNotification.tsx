/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo } from 'react';

interface Props {
  errorMessage: string;
  setErrorMessage: (value: string) => void,
}
export const ErrorNotification: FC<Props> = memo(({
  errorMessage, setErrorMessage,
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </>
  );
});
