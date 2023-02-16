/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<Error>>;
};

export const ErrorNotification:React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(Error.None);
    }, 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.None)}
      />
      {errorMessage}
    </div>
  );
};
