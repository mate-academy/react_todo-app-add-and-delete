import cn from 'classnames';

import { ErrorType } from '../types';

interface Props {
  errorMessage: ErrorType | null;
  clearErrorMessage: () => void;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  clearErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
