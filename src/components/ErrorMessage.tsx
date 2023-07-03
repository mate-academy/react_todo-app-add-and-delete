/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo } from 'react';

type Props = {
  errorMessage: string;
  removeError: () => void
};

export const ErrorMessage: FC<Props> = memo(({ errorMessage, removeError }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={removeError}
      />
      <h2>{errorMessage}</h2>
    </div>
  );
});
