/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  isError: string | null,
  setIsError: (value: string | null) => void;
};

export const TodoErrorNotification: React.FC<Props> = ({
  isError,
  setIsError,
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => setIsError(null), 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(null)}
      />
      {isError}
    </div>
  );
};
