import classNames from 'classnames';

type Props = {
  error: string | null;
};
export const ErrorNotification: React.FC<Props> = ({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
