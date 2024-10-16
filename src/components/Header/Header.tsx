import { FC, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { USER_ID } from '../../utils/UserId';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';
import { handleError } from '../../utils/HandleError';
import { postTodo } from '../../api/todos';

interface Props {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<ErrorMessages>>;
  tempTodo: Todo | null;
  todos: Todo[];
}

export const Header: FC<Props> = ({
  setError,
  setTempTodo,
  setTodos,
  tempTodo,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputValue = inputRef.current?.value.trim();

    if (!inputValue) {
      handleError(setError, ErrorMessages.EmptyTitle);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    postTodo(temporaryTodo)
      .then(res => {
        setTodos(current => [...current, res]);

        if (inputRef.current?.value) {
          inputRef.current.value = '';
        }

        setTempTodo(null);
      })
      .catch(() => {
        setTempTodo(null);
        handleError(setError, ErrorMessages.AddFail);

        if (inputRef.current?.value) {
          inputRef.current.value = inputValue;
        }
      });
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
