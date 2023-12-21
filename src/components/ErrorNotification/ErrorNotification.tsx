import { FC } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  setErrorMessage: (error: Errors) => void,
  errorMessage : string | null,
}

export const ErrorNotification: FC<Props> = (props) => {
  const {
    errorMessage,
    setErrorMessage,
  } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        aria-label="delete button"
        className={cn('delete', {
          hidden: !errorMessage,
        })}
        onClick={() => {
          setErrorMessage(Errors.Null);
        }}
      />
      {errorMessage}
    </div>
  );
};
