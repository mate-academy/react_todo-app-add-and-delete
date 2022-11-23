import classNames from 'classnames';
import { Error } from '../../types/Error';
import '../../styles/index.scss';

type Props = {
  isError: Error;
  handleErrorClose: () => void;
};

export const ErrorNotifications: React.FC<Props> = ({
  isError,
  handleErrorClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError.status },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide Error"
        onClick={handleErrorClose}
      />

      {isError.message}
    </div>
  );
};
