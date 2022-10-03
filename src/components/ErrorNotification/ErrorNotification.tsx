import { ErrorType } from '../../types/ErrorType';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  onErrorType: (errorType: ErrorType) => void;
  errorType: ErrorType,
};

export const ErrorNotification: React.FC<Props> = ({
  onErrorType, errorType,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorType(ErrorType.none)}
      />

      {errorType === ErrorType.add && 'Unable to add a todo'}

      {errorType === ErrorType.delete && 'Unable to delete a todo'}

      {errorType === ErrorType.update && 'Unable to update a todo'}

      {errorType === ErrorType.load && 'Unable to load a todos'}

      {errorType === ErrorType.emptyTitle && 'Title can\'t be empty'}
    </div>
  );
};
