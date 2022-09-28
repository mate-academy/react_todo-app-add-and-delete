import classnames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorText: Error;
  handleErrorChange: (error: Error | null) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorText,
  handleErrorChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorText },
      )}
    >
      <>
        <button
          aria-label="HideErrorButton"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleErrorChange(null)}
        />

        {errorText}
      </>
    </div>
  );
};
