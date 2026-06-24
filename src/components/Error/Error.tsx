//DON'T use conditional rendering to hide the notification
//Add the 'hidden' class to hide the message smoothly

import classNames from 'classnames';

interface Props {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const Error: React.FC<Props> = ({ error, setError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
