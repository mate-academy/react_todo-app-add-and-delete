import cn from 'classnames';
// import { useState } from 'react';
import { NewTodo } from './TodoForm';
import { useTodosContext } from '../../utils/TodosContext';

export const TodoAppHeader = () => {
  const {
    todos, value, setValue, handleToggleComplete,
  } = useTodosContext();
  const isActive = todos.filter(todo => !todo.completed).length > 0;

  return (
    <header className="todoapp__header">
      {
        //   eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn({
            'todoapp__toggle-all active': isActive,
            'todoapp__toggle-all': !isActive,
          })}
          onClick={handleToggleComplete}
        />
      }

      <NewTodo value={value} setValue={setValue} />
    </header>
  );
};
