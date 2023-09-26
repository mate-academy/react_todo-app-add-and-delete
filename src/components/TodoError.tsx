import cn from 'classnames';
import { ErrorMessage } from '../types/Todo';

type Props = {
  error: ErrorMessage | '';
  setError: (newErr: ErrorMessage | '') => void;
};

export const TodoError: React.FC<Props> = ({ error, setError }) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !error,
    })}
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
