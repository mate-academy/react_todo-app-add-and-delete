import classNames from 'classnames';

type Props = {
  error:string;
  closeError: () => void;
};

export const Errors: React.FC<Props> = (
  {
    error,
    closeError,
  },
) => {
  return (
    <>
      {error && (
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: error.length === 0,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            aria-label="HideErrorButton"
            onClick={() => closeError()}
          />

          {error === 'empty'
            ? ('Title can\'t be empty')
            : (`Unable to ${error} a todo`)}
        </div>
      )}
    </>
  );
};
