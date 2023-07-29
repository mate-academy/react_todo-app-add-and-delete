import classNames from 'classnames';

type Props = {
  setError: (error: string) => void;
  error: string;
};

export const ErrorMessage: React.FC<Props> = ({
  setError,
  error,
}) => (
  <div
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error },
    )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError('')}
      aria-label="removeError"
    />
    {error}
  </div>
);
