import classNames from 'classnames';

import { useError } from '../providers';
import { ERRORS } from '../utils';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useError();

  return (
    <div
      data-cy="ErrorNotification"
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
        aria-label="Hide Error"
        data-cy="HideErrorButton"
        onClick={() => setError(ERRORS.NONE)}
      />
      {error}
    </div>
  );
};
