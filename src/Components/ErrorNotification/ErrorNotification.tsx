import classNames from 'classnames';
import React, { useContext } from 'react';
import { wait } from '../../utils/fetchClient';
import { Actions, DispatchContext, StateContext } from '../../Store';

export const ErrorNotification: React.FC = () => {
  const { errorLoad } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideErrorMessage = () => {
    dispatch({
      type: Actions.setErrorLoad,
      payload: '',
    });
  };

  wait(3000).then(() => {
    if (errorLoad) {
      dispatch({
        type: Actions.setErrorLoad,
        payload: '',
      });
    }
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorLoad,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrorMessage}
      />
      {/* show only one message at a time +*/}
      {errorLoad}
      {/* Unable to update a todo */}
    </div>
  );
};
