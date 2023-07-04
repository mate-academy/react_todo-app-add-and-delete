/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: (error: null | string) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => (
  <div className={cn(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: !error },
  )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError(null)}
    />

    {error}

  </div>
);
