import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { StateContext } from '../../store/State';

export const ErrorNotification: React.FC = () => {
  const { error } = useContext(StateContext);
  const [isVisible, setIsVisible] = useState(true);

  setTimeout(() => {
    setIsVisible(false);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isVisible,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsVisible(false)}
      />
      {error}
    </div>
  );
};
