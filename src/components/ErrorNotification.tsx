import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  error: ErrorMessage | null;
};

export const ErrorNotification: React.FC<Props> = ({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === null },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error && (
        <>
          {error}
          <br />
        </>
      )}
    </div>
  );
};
