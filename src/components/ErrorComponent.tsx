import cn from 'classnames';

interface Props {
  errorMessage: string;
  handleCleanButton: () => void;
}

export const ErrorComponent: React.FC<Props> = ({
  errorMessage,
  handleCleanButton,
}) => {
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
        className="delete hidden"
        onClick={handleCleanButton}
      />
      {errorMessage}
    </div>
  );
};
