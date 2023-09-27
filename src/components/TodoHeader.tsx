/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  onTodoAdd: (title: string) => void,
  isToggleActive: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  onTodoAdd,
  isToggleActive,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onTodoAdd(todoTitle);
    setTodoTitle('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isToggleActive },
        )}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      {false ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <form onSubmit={handleTodoAdd}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleTitleChange}
            />
          </form>
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </header>
  );
};
