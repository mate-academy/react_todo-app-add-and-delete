import cn from 'classnames';

type Props = {
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>
};

export const ErrorMessages: React.FC<Props> = ({ error, setError }) => {
  if (error) {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
