/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

type Props = {
  errorMessage: string,
  clearError: () => void;
};

export const ErrorPanel: React.FC<Props> = ({
  errorMessage,
  clearError,
}) => (
  <div className={cn(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: !errorMessage },
  )}
  >
    <button
      type="button"
      className="delete"
      onClick={clearError}
    />
    {errorMessage}
  </div>
);
