/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error;
  setError: (value: Error) => void;
};

export const TodoNotification: React.FC<Props> = ({ error, setError }) => (
  <div
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      {
        hidden: !error,
      },
    )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError(Error.None)}
    />

    {error && (
      <p>
        {error === 'empty'
          ? "Title can't be empty"
          : `Unable to ${error} a todo`}
      </p>
    )}
  </div>
);
