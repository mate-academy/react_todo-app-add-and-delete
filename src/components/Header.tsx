import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  defaultInputRef: React.RefObject<HTMLInputElement>;
  currentTodos: Todo[];
  postNewTodo: (todoToPost: Todo | null) => void;
  showError(errMessage: string): void;
  todoBeingAdded: boolean;
  clearInput: boolean;
  setClearInput: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  defaultInputRef,
  currentTodos,
  postNewTodo,
  showError,
  todoBeingAdded,
  clearInput,
  setClearInput,
  handleToggleAll,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    if (trimmedValue) {
      postNewTodo({
        id: Math.floor(1000000 + Math.random() * 9000000),
        userId: USER_ID,
        title: trimmedValue,
        completed: false,
      });
    } else {
      showError('Title should not be empty');
    }
  };

  if (clearInput && inputValue !== '') {
    setInputValue('');
    setClearInput(false);
  }

  return (
    <header className="todoapp__header">
      {currentTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !currentTodos.some(todo => !todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={defaultInputRef}
          disabled={todoBeingAdded}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </form>
    </header>
  );
};
