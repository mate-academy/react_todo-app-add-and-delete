import classNames from 'classnames';
import { useTodosContext } from '../../helpers/useTodoContext';

interface ErrorNotificationProps {
  clearErrorMessage: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  clearErrorMessage,
}) => {
  const { errorMessage } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => clearErrorMessage()}
      />
      {errorMessage}
    </div>
  );
};
