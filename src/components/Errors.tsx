import classNames from 'classnames';
import { useCallback, useEffect, useRef } from 'react';
import { ErrorMessage } from '../types/Errors';

type Props = {
  currError: string;
  setCurrError: React.Dispatch<React.SetStateAction<string>>;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>
};

export const Errors: React.FC<Props> = ({
  currError,
  setCurrError,
  setHasError,
}) => {
  const timer = useRef<NodeJS.Timer>();
  const isHidden = currError === ErrorMessage.None;

  const clearError = useCallback(
    () => {
      setCurrError('');
      setHasError(false);
    },
    [currError],
  );

  useEffect(() => {
    if (!isHidden) {
      timer.current = setTimeout(() => {
        setCurrError(ErrorMessage.None);
      }, 3000);
    } else {
      clearTimeout(timer.current);
    }
  }, [currError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Toggle All"
        onClick={clearError}
      />

      {currError}
    </div>
  );
};
