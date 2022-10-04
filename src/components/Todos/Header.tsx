import {
  Dispatch, FormEvent, SetStateAction, useEffect, useRef,
} from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  userId: number;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setLoader: Dispatch<SetStateAction<boolean>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  userId,
  todos,
  setTodos,
  setError,
  setErrorMessage,
  setLoader,
  title,
  setTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSumbit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (title.length < 1) {
      setError(true);
      setErrorMessage("Title can't be empty");

      return;
    }

    createTodo(userId, normalizedTitle)
      .then(addedTodo => {
        setTodos([...todos, addedTodo]);
        setLoader(true);
        setTitle('');
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to add a todo');
      });

    setLoader(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="ToggleAllButton"
      />

      <form onSubmit={handleSumbit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
