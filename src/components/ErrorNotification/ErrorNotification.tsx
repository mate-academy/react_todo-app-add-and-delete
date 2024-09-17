import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: string;
  onClose: (message: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
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
        className={classNames('delete', { hidden: !errorMessage })}
        onClick={() => {
          onClose(ErrorMessage.NoErrors);
        }}
      />
      {errorMessage}
    </div>
  );
};
