import { FC } from 'react';
import { Error, ErrorMessage } from '../../types/Error';

type Props = {
  errorMessage: string,
  closeError: React.Dispatch<React.SetStateAction<Error>>,
};

const Notification: FC<Props> = ({
  errorMessage,
  closeError,
}) => {
  const closeErrorMessage = () => {
    closeError({
      status: false,
      message: ErrorMessage.NONE,
    });
  };

  setTimeout(() => closeError({
    status: false,
    message: ErrorMessage.NONE,
  }), 2000);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />
      {errorMessage}
    </div>
  );
};

export default Notification;
