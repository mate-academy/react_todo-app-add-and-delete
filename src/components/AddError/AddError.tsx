import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  error: string,
};

export const AddError: React.FC<Props> = ({ error }) => {
  const [closeError, setCloseError] = useState(false);

  return (
    <div className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !closeError },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close"
        onClick={() => setCloseError(true)}
      />

      {error}
    </div>
  );
};
