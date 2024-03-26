import { useEffect, useRef } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setPreparedTodos: (e: Todo[]) => void;
  todos: Todo[];
  title: string;
  setTitle: (e: string) => void;
  setErrorMessage: (m: string) => void;
  todoId: number;
  isSubmitting: boolean;
  setIsSubmitting: (s: boolean) => void;
  setTempTodo: (o: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  setPreparedTodos,
  todos,
  setTitle,
  setErrorMessage,
  title,
  todoId,
  isSubmitting,
  setIsSubmitting,
  setTempTodo,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(`Title should not be empty`);

      return;
    }

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: 292,
      completed: false,
    });

    setIsSubmitting(true);

    addTodo(todoId, title.trim())
      .then(() => {
        setTitle('');
        setErrorMessage('');
        setTempTodo(null);
        setPreparedTodos([
          ...todos,
          {
            id: todoId,
            userId: 292,
            title: title.trim(),
            completed: false,
          },
        ]);
      })
      .catch(() => {
        setErrorMessage(`Unable to add a todo`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
