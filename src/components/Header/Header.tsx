import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { postTodos, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/Errors';

type Props = {
  setError: (message: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  isPosting: boolean;
  setIsPosting: (value: boolean) => void;
  isProcessing: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  setError,
  setTempTodo,
  setTodos,
  isPosting,
  setIsPosting,
  isProcessing,
  inputRef,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const temp = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsPosting(true);
    setTempTodo(temp);

    try {
      const addedTodo = await postTodos({
        title: temp.title,
        userId: temp.userId,
        completed: temp.completed,
      });

      setTodos(prev => [...prev, addedTodo]);
      setTitle('');
    } catch {
      setError(ErrorMessage.AddTodo);
      setTempTodo(null);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsPosting(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isPosting && !isProcessing) {
      inputRef.current?.focus();
    }
  }, [isPosting, isProcessing, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={e => setTitle(e.target.value)}
          disabled={isPosting}
        />
      </form>
    </header>
  );
};
