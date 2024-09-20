import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onCloseErrorMessage: () => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  onCloseErrorMessage,
}) => {
  useEffect(() => {
    const timeout = setTimeout(onCloseErrorMessage, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
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
