import { FC, Dispatch } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
};

export const ErrorMessage: FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      // eslint-disable-next-line max-len
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={cn('delete', { hidden: !errorMessage })}
        onClick={() => setErrorMessage(Errors.Default)}
      />
      {errorMessage}
    </div>
  );
};
