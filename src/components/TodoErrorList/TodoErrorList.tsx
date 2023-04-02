/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  setError: (error: boolean) => void,
};

export const TodoErrorList: React.FC<Props> = ({ setError }) => {
  const [isErrorVisible, setIsErrorVisible] = useState(true);

  const hideError = () => {
    setIsErrorVisible(false);

    setError(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isErrorVisible,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={hideError}
      />

      Unable to add a todo
    </div>
  );
};
