import { memo, useCallback, useEffect, useRef } from 'react';
import { ErrorMessages } from '../../types/Errors';

type Props = {
  errorMessage: ErrorMessages;
  onErrorClean: (error: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = memo(
  function ErrorNotification({ errorMessage, onErrorClean }) {
    const errorNotification = useRef<HTMLDivElement>(null);

    const deleteNotification = useCallback(() => {
      errorNotification.current?.classList.add('hidden');
      onErrorClean(ErrorMessages.None);
    }, [onErrorClean]);

    useEffect(() => {
      if (errorMessage) {
        errorNotification.current?.classList.remove('hidden');

        setTimeout(deleteNotification, 3000);
      }
    }, [errorMessage, deleteNotification]);

    return (
      <div
        ref={errorNotification}
        data-cy="ErrorNotification"
        className="
        notification is-danger is-light 
        has-text-weight-normal hidden
      "
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={deleteNotification}
        />

        {errorMessage}
      </div>
    );
  },
);
