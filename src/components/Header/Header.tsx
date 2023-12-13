import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  todosFromServer: Todo[];
  createNewTodo: (title: string) => Promise<void>;
  errorFound: (error: ErrorType) => void
}

export const Header = ({
  todosFromServer,
  createNewTodo,
  errorFound,
}: Props) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoTitleDisabled, setTodoTitleDisabled] = useState(false);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [todoTitleDisabled]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      errorFound(ErrorType.TitleEmpty);

      return;
    }

    setTodoTitleDisabled(true);
    createNewTodo(title)
      .then(() => setTodoTitle(''))
      .catch(() => {})
      .finally(() => {
        setTodoTitleDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="Toggle All"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todosFromServer.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={todoTitleDisabled}
          ref={todoTitleRef}
        />
      </form>
    </header>
  );
};
