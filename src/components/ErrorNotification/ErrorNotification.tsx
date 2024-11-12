import cn from 'classnames';
import { Dispatch, FC, SetStateAction } from 'react';

interface ErrorNotificationProps {
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export const ErrorNotification: FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
