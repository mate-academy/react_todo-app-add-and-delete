import classnames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  isErrorHidden: boolean;
  onHideError: (value: boolean) => void;
};

export const TodoNotification: React.FC<Props> = ({
  errorMessage,
  isErrorHidden,
  onHideError,
}) => {
  useEffect(() => {
    if (errorMessage.length !== 0) {
      onHideError(false);
    }

    setTimeout(() => {
      onHideError(true);
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isErrorHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => onHideError(true)}
      />

      {errorMessage}
    </div>
  );
};
