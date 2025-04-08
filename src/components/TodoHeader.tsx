import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  tempTodo: Todo | null;
  todos: Todo[];
  handleAllToggle: () => void;
  handleAddTodo: (title: string) => Promise<void>;
  isLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  tempTodo,
  todos,
  handleAllToggle,
  handleAddTodo,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await handleAddTodo(inputValue);
      setInputValue('');
    } catch {}
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleAllToggle}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={tempTodo !== null}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
