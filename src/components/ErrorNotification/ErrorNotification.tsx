import classNames from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  isError: boolean
  error: Errors;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  error,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal',
          { hidden: !isError })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="Error button"
        className="delete"
        onClick={onClose}
      />
      {error}
    </div>
  );
};
