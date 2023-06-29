import classNames from 'classnames';
import { ErrorType } from '../../types/Error';

type Props = {
  errorType: ErrorType,
  onError: (error: ErrorType) => void,
};

export const TodosError: React.FC<Props> = ({
  errorType,
  onError: setErrorType,
}) => {
  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorType },
      )}
    >

      <button
        type="button"
        className="delete"
        onClick={() => setErrorType(ErrorType.NONE)}
        aria-label="Close error message"
      />

      {errorType === ErrorType.LOAD && 'Unable to load todos'}
      {errorType === ErrorType.ADD && 'Unable to add a todo'}
      {errorType === ErrorType.DELETE && 'Unable to delete a todo'}
      {errorType === ErrorType.UPDATE && 'Unable to update a todo '}
    </div>
  );
};
