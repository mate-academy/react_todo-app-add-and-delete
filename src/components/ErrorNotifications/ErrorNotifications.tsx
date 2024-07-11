import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';

export const ErrorNotifications: React.FC = () => {
  const { errorMessage } = useGlobalState();
  const dispatch = useDispatch();

  const handleHideError = () => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        'notification is-danger is-light has-text-weight-normal ' +
        (!errorMessage ? 'hidden' : '')
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {/* show only one message at a time */}
      {/* Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
      {errorMessage}
    </div>
  );
};

{
  /* DON'T use conditional rendering to hide the notification */
}

{
  /* Add the 'hidden' class to hide the message smoothly */
}
