import classNames from 'classnames';
import { Nullable } from '../../types/Nullable';

interface Props {
  errorMessage: Nullable<string>;
  onClose: () => void;
}

export const ErrorNotification = ({ errorMessage, onClose }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
