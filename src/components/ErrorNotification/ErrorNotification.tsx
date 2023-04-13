/* eslint-disable jsx-a11y/control-has-associated-label */
import { ErrorType } from '../../types/Error';

type Props = {
  error: ErrorType;
  deleteNotificationHandler: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  deleteNotificationHandler,
}) => {
  return (
    <div
      className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
    >
      <button
        type="button"
        className="delete"
        onClick={deleteNotificationHandler}
      />

      {error === ErrorType.Loading && 'Unable to load a todo'}
      {error === ErrorType.Post && 'Unable to add a todo'}
      {error === ErrorType.EmptyTitle && 'Title can\'t be empty'}
      {error === ErrorType.Delete && 'Unable to delete a todo'}
    </div>
  );
};
