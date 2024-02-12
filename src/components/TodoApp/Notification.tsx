/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useContext, useEffect } from 'react';

import cn from 'classnames';
import { DispatchContext, StateContext } from '../Context/StateContext';

export const Notification: React.FC = () => {
  const { notification } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideNotification = useCallback(() => {
    dispatch({
      type: 'showNotification',
      notification: null,
    });
  }, [dispatch]);

  useEffect(() => {
    const timerID = setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => clearTimeout(timerID);
  }, [hideNotification, notification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !notification,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideNotification}
      />
      <span>
        {notification}
      </span>
    </div>
  );
};
