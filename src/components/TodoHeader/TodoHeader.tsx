import { useEffect, useRef, useState } from 'react';
import { addTodos, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMessage: (arg: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: (todo: Todo | null) => void;
  isLoading: boolean;
  setIsLoading: (arg: boolean) => void;
};

export const TodoHeader: React.FC<Props> = ({
  setErrorMessage,
  setTodos,
  setTempTodo,
  setIsLoading,
  isLoading,
}) => {
  const focusOnInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodos({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodo => [...currentTodo, newTodo]);
      setTempTodo(null);
      setTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (focusOnInput.current) {
      focusOnInput.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => {}}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={focusOnInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
