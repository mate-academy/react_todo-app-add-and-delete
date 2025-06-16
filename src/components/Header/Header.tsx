import cn from 'classnames';
import { Dispatch, useState } from 'react';
import { TodosError } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  allTodosCompleted: boolean;
  handleTodoAdd: (title: string) => Promise<void>;
  setErrorMessage: Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: Dispatch<React.SetStateAction<Todo | null>>;
  inputFocus: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  allTodosCompleted,
  handleTodoAdd,
  setErrorMessage,
  setTempTodo,
  inputFocus,
}) => {
  const [title, setTitle] = useState<string>('');

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());
    setErrorMessage(null);
  };

  const inputElement = inputFocus.current;

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputElement) {
      inputElement.disabled = true;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(TodosError.titleNotEmpty);

      if (inputElement) {
        inputElement.disabled = false;
        inputElement.focus();
      }

      return;
    }

    handleTodoAdd(trimmedTitle)
      .then(() => setTitle(''))
      .catch(() => {
        setErrorMessage(TodosError.unableToAdd);
        setTempTodo(null);
      })
      .finally(() => {
        if (inputElement) {
          inputElement.disabled = false;
          inputElement.focus();
        }
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleOnSubmit}>
        <input
          ref={inputFocus}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
        />
      </form>
    </header>
  );
};
