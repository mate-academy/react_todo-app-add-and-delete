import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorText: string,
  setErrorText: (value: string) => void,
};

export const Errors: React.FC<Props> = ({
  errorText,
  setErrorText,
}) => {
  const [closeError, setCloseError] = useState(false);

  useEffect(() => {
    const vanishing = setTimeout(() => setErrorText(''), 2500);

    return () => {
      clearTimeout(vanishing);
    };
  }, [closeError, errorText]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: closeError },
      )}
    >
      <button
        aria-label="Close errors"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setCloseError(true)}
      />
      {errorText}
    </div>
  );
};
