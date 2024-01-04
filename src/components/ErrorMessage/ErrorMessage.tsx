/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

interface Props {
  errorMessage: string;
}

export const ErrorMessage: FC<Props> = ({ errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
