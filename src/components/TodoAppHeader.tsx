import React, { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../context/ContextReducer';

export const TodoAppHeader: React.FC = () => {
  const { selectedAll, todoApi, query} = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: selectedAll || todoApi.every(todo => todo.completed)})}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={() => dispatch({ type: "addTodo" })}>
        <input
          onChange={event => dispatch({ type: 'setQuery', value: event.target.value})}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
        />
      </form>
    </header>
  );
};
