import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorText: string;
  seterrorText: (value: string) => void;
};
export const ErrorNotifaction: React.FC<Props> = ({
  errorText,
  seterrorText,
}) => {
  const [hideError, setHideError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => seterrorText(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [hideError, errorText]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: hideError,
          },
        )
      }
    >
      <button
        aria-label="close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHideError(true)}
      />
      { errorText }
    </div>
  );
};
