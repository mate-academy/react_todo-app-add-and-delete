import { Dispatch, FC, FormEvent, useEffect, useState } from 'react';
import { USER_ID, addTodos } from '../api/todos';

import { Todo } from '../types/Todo';
import useFocusInput from '../hooks/useFocusInput';

interface Props {
  onErrorMessage: (message: string) => void;
  errorMessage: string;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: Dispatch<React.SetStateAction<Todo | null>>;
  deletingId: number;
}

const Header: FC<Props> = ({
  onErrorMessage,
  setTodos,
  setTempTodo,
  errorMessage,
  deletingId,
}) => {
  const inputRef = useFocusInput();
  const [title, setTitle] = useState('');
  const [isSendingTodo, setIsSendingTodo] = useState(false);

  useEffect(() => {
    if (title.trim() === '' && !isSendingTodo) {
      inputRef.current?.focus();
    }

    if (deletingId) {
      inputRef.current?.focus();
    }

    if (errorMessage && errorMessage !== '') {
      inputRef.current?.focus();
    }
  }, [title, isSendingTodo, deletingId, errorMessage, inputRef]);

  const addTodo = () => {
    setIsSendingTodo(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    addTodos(newTodo)
      .then(createdTodo => {
        setTodos((prevState: Todo[]) => [...prevState, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        onErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSendingTodo(false);
        setTempTodo(null);
      });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      onErrorMessage('Title should not be empty');
      setTimeout(() => {
        onErrorMessage('');
      }, 3000);

      return;
    }

    addTodo();
  };

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
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSendingTodo}
        />
      </form>
    </header>
  );
};

export default Header;
