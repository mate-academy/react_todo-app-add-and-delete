import React, { useContext, useState } from 'react';
import classNames from 'classnames';

import { TodoContext } from '../TodoContext';

export const Notification: React.FC = () => {
  const { errorMessage } = useContext(TodoContext);
  const [isHidden, setIsHidden] = useState(false);

  setTimeout(() => {
    setIsHidden(true);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification '
            + 'is-danger '
            + 'is-light '
            + 'has-text-weight-normal',
      { hidden: isHidden })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
        aria-label="Close error notification"
      />
      {errorMessage}
    </div>
  );
};
