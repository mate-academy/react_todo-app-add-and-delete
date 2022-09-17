/* eslint-disable jsx-a11y/control-has-associated-label */
import cN from 'classnames';

type Props = {
  errors: boolean,
  errorTitle: boolean,
  errorAdding: boolean,
  errorDeleting: boolean,
  errorUpdating: boolean,
  onErrorChange: (b: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errors,
  errorTitle,
  errorAdding,
  errorDeleting,
  errorUpdating,
  onErrorChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cN(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errors },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onErrorChange(false);
        }}
      />
      {errorTitle && 'Title can`t be empty'}
      {errorAdding && 'Unable to add a todo'}
      {errorDeleting && 'Unable to delete a todo'}
      {errorUpdating && 'Unable to update a todo'}
    </div>
  );
};
