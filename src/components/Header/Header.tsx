import { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { addTodo, USER_ID } from '../../api/todos';

type Props = {
  handleError: (error: string) => void;
  todos: Todo[];
  errorMessage: string;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Header: React.FC<Props> = ({
  handleError,
  todos,
  errorMessage,
  setTempTodo,
  setTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      handleError(ErrorMessage.TitleError);

      return;
    }

    setIsInputDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    addTodo({ userId: USER_ID, title: todoTitle.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        handleError(ErrorMessage.AddTodoError);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          ref={inputRef}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
