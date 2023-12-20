import cn from 'classnames';

interface Props {
  error: string | null
  onHideError: () => void
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const { error, onHideError } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        aria-label="Hide Error Button"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />

      <p>{error}</p>
    </div>
  );
};
