/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  handleError: (error: ErrorMessage, bool: boolean) => void;
  errorMessage: string;
  isError: boolean;
};

export const Notifications: React.FC<Props> = ({
  handleError,
  errorMessage,
  isError,
}) => {
  const handleCloseButton = () => {
    handleError(ErrorMessage.None, false);
  };

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isError },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseButton}
      />

      <p>{errorMessage}</p>

    </div>
  );
};
