import cn from 'classnames';
import React, { useContext, useEffect } from 'react';
import { DispatchContex } from '../../Store';

interface Props {
  errorMessage: string;
}
export const ErrorNotification: React.FC<Props> = React.memo(
  function ErrorNotification({ errorMessage }) {
    const dispatch = useContext(DispatchContex);

    useEffect(() => {
      if (errorMessage) {
        window.setTimeout(() => {
          dispatch({ type: 'set-error', payload: '' });
        }, 3000);
      }
    }, [dispatch, errorMessage]);

    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => dispatch({ type: 'set-error', payload: '' })}
        />
        {errorMessage}
      </div>
    );
  },
);
