import cn from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (newErrorMessage: string) => void;
};
export const Error: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setErrorMessage('')}
    />
    {errorMessage}
  </div>
);
