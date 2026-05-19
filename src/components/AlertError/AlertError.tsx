import cn from 'classnames';

type Props = {
  error: string;
  onClear: () => void;
};
export function AlertError({ error, onClear }: Props) {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClear}
      />

      {/* Unable to update a todo помилка при оновленні todo */}

      {error}
    </div>
  );
}
