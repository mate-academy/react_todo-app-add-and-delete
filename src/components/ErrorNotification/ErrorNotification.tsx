import cn from 'classnames';

type Props = {
  errorMessage: string;
  handleCloseError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleCloseError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseError}
      />
      {errorMessage}
      {/* this error messages will used in the next part of task */}
      {/* Unable to update a todo */}
    </div>
  );
};
