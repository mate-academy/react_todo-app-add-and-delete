import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  const isHidden = error === null;

  const getErrorMassage = () => {
    switch (error) {
      case 'LOAD_TODOS':
        return 'Unable to load todos';

      case 'ADD_TODO':
        return 'Unable to add a todo';

      case 'DELETE_TODO':
        return 'Unable to delete a todo';

      case 'EMPTY_TITLE':
        return 'Title should not be empty';

      case 'UPDATE_TODO':
        return 'Unable to update a todo';

      default:
        return '';
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {getErrorMassage()}
    </div>
  );
};
