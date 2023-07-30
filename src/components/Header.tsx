import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoError } from '../types/TodoError';
import { Todo } from '../types/Todo';

type Props = {
  countActiveTodos: number;
  handleAddTodo: (title: string) => Promise<void>;
  onError: (errorMessage: TodoError) => void;
  tempTodo: Todo | null;
  handleAllToggle: () => void;
};

export const Header: React.FC<Props> = ({
  countActiveTodos,
  onError,
  handleAddTodo,
  tempTodo,
  handleAllToggle,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (tempTodo === null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const addTodo = () => {
    if (todoTitle.trim() === '') {
      onError(TodoError.emptyTitle);

      return;
    }

    handleAddTodo(todoTitle.trim())
      .then(() => setTodoTitle(''));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: countActiveTodos,
        })}
        onClick={handleAllToggle}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
