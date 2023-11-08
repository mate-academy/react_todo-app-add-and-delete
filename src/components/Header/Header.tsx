import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext } from '../../TodoContext';
import { postTodos } from '../../api/todos';
import { ErrorsType } from '../../types/ErrorsType';

export const Header = () => {
  const {
    todos,
    setErrorMessage,
    setTodos,
    USER_ID,
    setTempTodo,
  } = useContext(TodoContext);
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isCompleted = todos.some(({ completed }) => completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emptyTitle = title.replaceAll(' ', '');

    if (emptyTitle.length === 0) {
      setErrorMessage(ErrorsType.Title);
      setTitle('');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(tempTodo);
    setIsSubmitting(true);

    try {
      const newTodo = await postTodos({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorsType.Add);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isCompleted,
          hidden: !todos.length,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          data-cy="NewTodoField"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.currentTarget.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
