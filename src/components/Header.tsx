import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/TodoError';

type Props = {
  tempTodo: Todo | null;
  countActiveTodos: number;
  handleAllToggle: () => void;
  handleAddTodo: (title: string) => Promise<void>;
  handleErrorMessage: (errorMessage: TodoError) => void;
};

export const Header: React.FC<Props> = ({
  tempTodo,
  countActiveTodos,
  handleAllToggle,
  handleAddTodo,
  handleErrorMessage,
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
      handleErrorMessage(TodoError.emptyTitle);

      return;
    }

    handleAddTodo(todoTitle.trim()).then(() => setTodoTitle(''));
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

      <form onSubmit={handleSubmit}>
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
