import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Error } from '../types/Error';

type Props = {
  errorMessage: Error
};

export const Errors: React.FC<Props> = ({ errorMessage }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, 3000);
  }, []);

  const onCloseClick = () => {
    setHidden(true);
  };

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close error"
        onClick={onCloseClick}
      />

      {errorMessage}
    </div>
  );
};
