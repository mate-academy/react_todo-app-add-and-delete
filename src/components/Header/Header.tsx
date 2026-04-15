import React, { useEffect, useRef, useState } from 'react';
import { ERROR_MESSAGES, Filter } from '../../App';
import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMessage: (message: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  addTodo: (todo: Todo) => void;
  appliedFilter: Filter;
  todos: Todo[];
};

const HeaderBase: React.FC<Props> = ({
  setErrorMessage,
  setTempTodo,
  addTodo,
  appliedFilter,
  todos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const newTodoInput = useRef<HTMLInputElement | null>(null);

  const handleChangeTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
    setErrorMessage('');
  };

  const clearForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage(ERROR_MESSAGES.emptyTitle);

      return;
    }

    setIsLoading(true);

    setTempTodo({
      id: 0,
      userId: client.USER_ID,
      title: todoTitle.trim(),
      completed: false,
    });

    client
      .addTodo(todoTitle.trim())
      .then(res => {
        setTempTodo(null);
        if (appliedFilter !== 'completed') {
          addTodo(res);
        }

        clearForm();
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage(ERROR_MESSAGES.failedAddingTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [isLoading, todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChangeTodoTitle}
          value={todoTitle}
          ref={newTodoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

export const Header = React.memo(HeaderBase);
