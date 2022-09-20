/* eslint-disable jsx-a11y/control-has-associated-label */
import cN from 'classnames';
import { Error } from '../../types/Errors';

type Props = {
  errors: Error,
  // errorTitle: boolean,
  // errorAdding: boolean,
  // errorDeleting: boolean,
  // errorUpdating: boolean,
  onErrorChange: (isError: Error | null) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errors,
  // errorTitle,
  // errorAdding,
  // errorDeleting,
  // errorUpdating,
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
          onErrorChange(null);
        }}
      />
      {errors}
      {/* {errorTitle && 'Title can`t be empty'}
      {errorAdding && 'Unable to add a todo'}
      {errorDeleting && 'Unable to delete a todo'}
      {errorUpdating && 'Unable to update a todo'} */}
    </div>
  );
};
