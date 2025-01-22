import { useEffect } from 'react';
import cn from 'classnames';

import { ErrorOptions } from '../types/ErrorOptions';

type Props = {
  errorOption: ErrorOptions;
  onError: (newErrorOption: ErrorOptions) => void;
};

export default function TodoError({ errorOption, onError }: Props) {
  useEffect(() => {
    if (errorOption === ErrorOptions.NONE) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onError(ErrorOptions.NONE);
    }, 3_000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorOption, onError]);

  return (
    <>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorOption === ErrorOptions.NONE,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onError(ErrorOptions.NONE)}
        />
        {/* show only one message at a time */}
        {errorOption}
      </div>
    </>
  );
}
