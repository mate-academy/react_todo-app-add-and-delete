import cn from 'classnames';
import { Dispatch, SetStateAction, useEffect, FC } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
};

export const ErrorNotification: FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (errorMessage) {
      timer = setTimeout(() => setErrorMessage(Errors.DEFAULT), 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [setErrorMessage, errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.DEFAULT)}
      />
      {errorMessage}
    </div>
  );
};
