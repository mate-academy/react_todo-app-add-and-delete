import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
};

export const Notification: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      {// eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button type="button" className="delete" />
      }
      {errorMessage}
    </div>
  );
};
