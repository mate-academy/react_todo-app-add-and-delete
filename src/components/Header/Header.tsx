import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  FC,
} from 'react';
import { Todo } from '../../types/Todo';
import { todosService } from '../../api';
import { USER_ID } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  tempTodo: Todo | null;
  setTempTodo: Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<React.SetStateAction<boolean>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorMessage: (Error: Errors) => void;
  errorMessage: string;
};

export const Header: FC<Props> = ({
  setTempTodo,
  isLoading,
  setIsLoading,
  setErrorMessage,
  setTodos,
  errorMessage,
}) => {
  const field = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    const titleTrim = title.trim();

    if (!titleTrim) {
      setIsLoading(false);
      setErrorMessage(Errors.TITLE);

      return;
    }

    const newTodo = {
      userId,
      title: titleTrim,
      completed,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    return todosService
      .createTodo(newTodo)
      .then(defTodo => {
        setTodos(currentTodos => [...currentTodos, defTodo]);
        setNewTitle('');
      })
      .catch(() => setErrorMessage(Errors.ADD_TODO))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    addTodo({
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });
  };

  useEffect(() => {
    field.current?.focus();
  }, [isLoading, errorMessage]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitle}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
