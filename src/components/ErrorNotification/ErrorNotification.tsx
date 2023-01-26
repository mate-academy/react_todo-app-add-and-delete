/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

type Props = {
  onCloseErrorButton: () => void,
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({
  onCloseErrorButton,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseErrorButton}
      />
      {errorMessage}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
