import classnames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorStatus: boolean,
  setErrorStatus: (value: boolean) => void,
  errorText: string;
};

export const ErrorNotification: React.FC<Props> = ({
  errorStatus,
  setErrorStatus,
  errorText,
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => setErrorStatus(false), 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorStatus },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close"
        onClick={() => setErrorStatus(false)}
      />

      {errorText}
    </div>
  );
};
