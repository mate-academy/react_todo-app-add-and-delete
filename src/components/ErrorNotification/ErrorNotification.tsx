import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  errorNotification: string
};

export const ErrorNotification: React.FC<Props> = ({ errorNotification }) => {
  const [isErrorShown, setIsErrorShown] = useState(true);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isErrorShown,
        },
      )}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsErrorShown(false)}
      />

      {errorNotification}
    </div>
  );
};
