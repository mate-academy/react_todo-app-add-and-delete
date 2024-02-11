import React, { useContext } from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../management/TodoContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  // const [smoothly, setSmoothly] = useState(false);

  const closeMessageError = () => {
    dispatch({
      type: 'errorMessage',
      payload: '',
    });
  };

  // setTimeout(() => {
  //   setSmoothly(true);
  // }, 3000);

  setTimeout(() => {
    dispatch({
      type: 'errorMessage',
      payload: '',
    });
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close error message"
        onClick={closeMessageError}
      />
      {errorMessage}
      {/* Title should not be empty
      Unable to add a todo
      Unable to delete a todo
      Unable to update a todo */}
    </div>
  );
};
