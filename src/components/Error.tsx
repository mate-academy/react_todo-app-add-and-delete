import cn from 'classnames';

interface Props {
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
}

export const Error: React.FC<Props> = ({ error, setError }) => {
  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      },
    )}
    >
      <button
        aria-label="delete error"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
