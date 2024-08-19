import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';

import { Errors } from '../../types/Errors';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type HeaderProps = {
  areAllTodosCompleted: boolean;
  handleErrorMessage: (message: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  handleAddTodoToState: (todo: Todo) => void;
  todosToBeDeleted: number[];
};

export const Header: React.FC<HeaderProps> = ({
  setTempTodo,
  areAllTodosCompleted,
  handleErrorMessage,
  handleAddTodoToState,
  todosToBeDeleted,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      handleErrorMessage(Errors.EmptyTitle);

      return;
    }

    try {
      const newTodo = {
        id: Date.now(),
        userId: 947,
        title: inputValue.trim(),
        completed: false,
      };

      setTempTodo(newTodo);
      setInputDisabled(true);

      const result = await createTodo(inputValue.trim());

      handleAddTodoToState(result);

      setInputValue('');
    } catch (error) {
      handleErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputDisabled, todosToBeDeleted]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          autoFocus
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
