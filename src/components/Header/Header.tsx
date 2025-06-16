import { FC, useEffect, useRef, useState } from 'react';
import { postTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';

interface HeaderProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  processingTodoIds: Todo['id'][];
}

export const Header: FC<HeaderProps> = ({
  setTodos,
  setErrorMessage,
  setTempTodo,
  processingTodoIds,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && processingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, processingTodoIds]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());
  };

  const temporaryTodo: Todo = {
    id: 0,
    title,
    userId: USER_ID,
    completed: false,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const titleTrimed = title.trim();

    if (!titleTrimed) {
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    setTempTodo(temporaryTodo);
    setIsSubmitting(true);

    try {
      const newTodo = await postTodo({
        title: titleTrimed,
        userId: USER_ID,
      });

      setTodos(current => {
        const withoutTemp = current.filter(todo => todo.id !== 0);

        return [...withoutTemp, newTodo];
      });
      setTempTodo(null);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessages.AddFailed);
      setTempTodo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
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
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
