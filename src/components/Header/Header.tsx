/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { NotificationText } from '../../types/enums';
import { USER_ID } from '../../utils/user';
import * as todosService from '../../utils/todos';

import { Todo } from '../../types/Todo';

interface Props {
  showError: (errorMessage: NotificationText) => void;
  setNewTodo: (todo: Todo) => void;
  setTempTodo: (todo: Todo | null) => void;
}

export const Header: React.FC<Props> = React.memo(({
  setNewTodo,
  showError,
  setTempTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  function reset() {
    setInputValue('');
    setIsInputDisabled(false);
    setTempTodo(null);
  }

  const addNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue) {
      showError(NotificationText.InputIsEmpty);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo(tempTodo);
    setIsInputDisabled(true);

    todosService.addTodo(inputValue, false)
      .then(setNewTodo)
      .catch((error) => {
        showError(NotificationText.Add);
        setTempTodo(null);
        throw error;
      })
      .finally(() => {
        reset();
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={addNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={input => setInputValue(input.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
});
