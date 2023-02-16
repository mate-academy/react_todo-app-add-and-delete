/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  error: string,
};

export const Error: React.FC<Props> = ({ error }) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (error) {
      setIsHidden(false);
      setTimeout(() => {
        setIsHidden(true);
      }, 3000);
    }
  }, [error]);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      <button
        title="close"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error}
    </div>
  );
};
