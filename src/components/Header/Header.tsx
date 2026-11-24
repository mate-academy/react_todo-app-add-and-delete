import classNames from 'classnames';
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

export const Header = ({
  todos,
  createTodo,
  setErrorMessage,
  inputRef,
}: {
  todos: Todo[];
  createTodo: (title: string) => Promise<boolean>;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  inputRef: RefObject<HTMLInputElement>;
}) => {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [inputRef, isAdding]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      setIsAdding(true);

      createTodo(trimmedTitle)
        .then(success => {
          if (success) {
            setTitle('');
          }
        })
        .catch(() => {
          setErrorMessage(Errors.UnableToAddTodo);
        })
        .finally(() => setIsAdding(false));
    } else {
      setErrorMessage(Errors.TitleShouldNotBeEmpty);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length === todos.filter(todo => todo.completed).length,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
