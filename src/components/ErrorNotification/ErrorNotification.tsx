import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  status: boolean;
  statusMessage: string;
  setStatus: (status: boolean) => void;
  setStatusMessage: (status: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  status,
  statusMessage,
  setStatus,
  setStatusMessage,
}) => {
  useEffect(() => {
    if (!status) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus(false);
      setStatusMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [status, statusMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames({
        'notification is-danger is-light has-text-weight-normal': true,
        hidden: !status,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setStatus(false);
          setStatusMessage('');
        }}
      />
      {/* show only one message at a time */}
      {/* 
      Unable to update a todo */}
      {statusMessage}
    </div>
  );
};
