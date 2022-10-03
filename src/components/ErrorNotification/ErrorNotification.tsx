/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState, useMemo } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
};

export const ErrorNotification: FC<Props> = ({ errorMessage }) => {
  const [isClosed, setIsClosed] = useState(false);

  useMemo(() => setTimeout(() => {
    setIsClosed(true);
  }, 3000), [isClosed]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isClosed },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsClosed(true)}
      />

      {errorMessage}
    </div>
  );
};
