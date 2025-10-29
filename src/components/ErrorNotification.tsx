import classNames from 'classnames';
import { FC } from 'react';

type Props = {
  errorMessage: string;
  onCloseError: () => void;
};

export const ErrorNotification: FC<Props> = ({
  errorMessage,
  onCloseError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage.length },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {errorMessage}
      {/* Unable to update a todo */}
    </div>
  );
};
