import classNames from 'classnames';
import { SetStateAction } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<SetStateAction<string>>;
};

export const Notifications: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(' is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
        notification: errorMessage,
      })}
    >
      {errorMessage && (
        <>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </>
      )}
    </div>
  );
};

{
  /* Unable to delete a todo
        <br />
        Unable to update a todo */
}
