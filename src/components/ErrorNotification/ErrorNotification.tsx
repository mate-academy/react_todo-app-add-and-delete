/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage } = useContext(TodosContext);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      setIsHidden(false);
    } else {
      setIsHidden(true);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
