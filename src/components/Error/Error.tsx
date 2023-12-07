import cn from 'classnames';
import { useEffect } from 'react';

type Props = {
  error: string,
  hiddenClass: boolean,
  onSetHiddenClass: (v: boolean) => void,
};

export const Error: React.FC<Props> = ({
  error,
  hiddenClass,
  onSetHiddenClass,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSetHiddenClass(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onSetHiddenClass]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: hiddenClass,
      })}
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onSetHiddenClass(true);
        }}
      />
      {/* show only one message at a time */}
      {error}
      {/* Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
