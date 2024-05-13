import { useCurrentState } from '../store/reducer';

export const ErrorNotification = () => {
  const { errorMessage } = useCurrentState();

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
