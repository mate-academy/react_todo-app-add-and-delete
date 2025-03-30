import cn from 'classnames';

interface Props {
  errorMessage: string;
  setErrorMessage: (arg: string) => void;
}

export const Error = ({ errorMessage, setErrorMessage }: Props) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      // eslint-disable-next-line prettier/prettier
      'hidden': !errorMessage,
    })}
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
