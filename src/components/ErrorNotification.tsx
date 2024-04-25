import classNames from 'classnames';
import { Error } from '../types/Error';

type Props = {
  currentError: Error | null;
  setCurrentError: (error: Error | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  currentError,
  setCurrentError,
}) => {
  const errorClass = classNames({
    hidden: currentError === null,
    notification: true,
    'is-danger': true,
    'is-light': true,
    'has-text-weight-normal': true,
  });

  return (
    <div data-cy="ErrorNotification" className={errorClass}>
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setCurrentError(null)}
      />
      {currentError}
    </div>
  );
};
