import { FC, useContext } from 'react';
import classNames from 'classnames';

import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { FormHeader } from '../HeaderTodo/FormHeader';

interface IProps {
  showError: (err: string) => void;
}

export const HeaderTodo: FC<IProps> = ({ showError }) => {
  const { todos, allCompleted } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  const handleToggleAll = () => {
    dispatch({ type: 'CHECK_ALL_TODO' });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <FormHeader showError={showError} />
    </header>
  );
};
