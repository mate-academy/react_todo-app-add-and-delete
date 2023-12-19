import React from 'react';
import cn from 'classnames';

import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage | null,
  onHide: () => void,
};

export const ErrorNotification: React.FC<Props> = React.memo((props) => {
  const { errorMessage, onHide } = props;

  return (
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
        onClick={onHide}
        aria-label="Hide Error"
      />
      {errorMessage}
    </div>
  );
});
