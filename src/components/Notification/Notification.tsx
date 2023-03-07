import { useState } from 'react';

import classNames from 'classnames';

type Props = {
  errorMessage: string
};

export const Notification: React.FC<Props> = ({ errorMessage }) => {
  const [isHidden, setIsHidden] = useState(false);

  const autoHide = () => {
    setTimeout(() => {
      setIsHidden(true);
    }, 3000);
  };

  autoHide();

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button // eslint-disable-line jsx-a11y/control-has-associated-label
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />

      {errorMessage}

    </div>

  );
};
