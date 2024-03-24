import cn from 'classnames';

import { Errors } from '../../types/Errors';

type Props = {
  error: Errors;
  setError: (error: Errors) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === Errors.default,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Errors.default)}
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
};
