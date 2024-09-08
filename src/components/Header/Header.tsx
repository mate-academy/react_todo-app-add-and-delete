import { useEffect, useRef, useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setErrorMessage: (error: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: (todos: Todo[]) => void;
};

export const Header = ({
  todos,
  setErrorMessage,
  setTempTodo,
  setTodos,
}: Props) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  });

  const handleFormSubmmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsDisabled(true);

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });
    addTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        input.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          disabled={isDisabled}
          ref={input}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
