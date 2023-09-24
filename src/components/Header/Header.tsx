import cn from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ERROR_MESSAGES } from '../../utils/constants/ERROR_MESSAGES';

type Props = {
  todos: Todo[],
  textInputRef: React.Ref<HTMLInputElement>,
  newTodoTitle: string,
  setErrorMessage: (error: string) => void,
  setNewTodoTitle: (value: string) => void,
  addTodo: (todo: Todo) => void,
  tempTodo: Todo,
};

export const Header: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  newTodoTitle,
  textInputRef,
  todos,
  setNewTodoTitle,
  tempTodo,
}) => {
  const [isInputDisabled, setInputDisabled] = useState(false);

  const visibleToogleAllButton = !!todos.length;
  // eslint-disable-next-line no-console
  console.log(setInputDisabled, isInputDisabled);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {visibleToogleAllButton && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: false })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (newTodoTitle.trim()) {
            const trimmedTitle = tempTodo.title.trim();
            const preparedTodo = { ...tempTodo, title: trimmedTitle };

            addTodo(preparedTodo);
            setNewTodoTitle('');
          } else {
            setErrorMessage(ERROR_MESSAGES.titleShouldNotBeEmpty);
          }
        }}
      >
        <input
          // disabled={isInputDisabled}
          value={newTodoTitle}
          onChange={handleInputChange}
          ref={textInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
