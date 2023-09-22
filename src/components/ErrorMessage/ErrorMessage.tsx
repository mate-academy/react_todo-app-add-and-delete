/* eslint-disable jsx-a11y/control-has-associated-label */

import { useTodo } from '../../provider/todoProvider';

/* Notification is shown in case of any error */
/* Add the 'hidden' class to hide the message smoothly */

export const ErrorMessage = () => {
  const { error, closeErrorMessage } = useTodo();

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />

      {error}
    </div>
  );
};
