/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable quote-props */
import { useEffect } from 'react';
import cn from 'classnames';
import { Error } from '../types/Error';

type Props = {
  error: Error,
  onClearErrors: React.Dispatch<React.SetStateAction<Error>>,
};

export const Errors: React.FC<Props> = ({ error, onClearErrors }) => {
  useEffect(() => {
    setTimeout(() => onClearErrors(Error.without), 3000);
  }, [error]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { 'hidden': error === Error.without },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onClearErrors(Error.without)}
      />

      {error === Error.add && (
        <> Unable to add a todo </>
      )}

      {error === Error.delete && (
        <> Unable to delete a todo </>
      )}

      {error === Error.update && (
        <> Unable to update a todo </>
      )}

      {error === Error.empty && (
        <> Title can&apos;t be empty </>
      )}
    </div>
  );
};
