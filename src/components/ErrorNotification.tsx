import classNames from 'classnames';
import { FC } from 'react';

type Props = {
  errorMessage: string;
  onCloseErrorMessage: () => void;
};

export const ErrorNotification: FC<Props> = ({
  errorMessage,
  onCloseErrorMessage,
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
        onClick={onCloseErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
