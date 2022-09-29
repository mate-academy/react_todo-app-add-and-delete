/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  const [isClose, setIsClose] = useState(false);

  setTimeout(() => {
    setIsClose(true);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isClose },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsClose(true)}
      />

      {errorMessage}
    </div>
  );
};
