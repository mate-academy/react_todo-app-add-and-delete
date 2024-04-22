import cn from 'classnames';
import { useContext } from 'react';
import { ContextTodos } from './TodoContext';

export const Error = () => {
  const { visibleErr, setVisibleErr, errMessage } = useContext(ContextTodos);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !visibleErr,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setVisibleErr(false)}
      />
      {errMessage}
    </div>
  );
};
