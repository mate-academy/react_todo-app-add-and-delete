import classNames from 'classnames';

type Props = {
  error: string | null;
  hideError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ErrorMessage: React.FC<Props> = ({ error, hideError }) => {
  {
    /* DON'T use conditional rendering to hide the notification */
  }

  {
    /* Add the 'hidden' class to hide the message smoothly */
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => hideError(null)}
      />
      {error}
    </div>
  );
};
