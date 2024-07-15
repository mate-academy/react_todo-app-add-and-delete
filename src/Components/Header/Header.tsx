import { Todo } from '../../types/Todo/Todo';
import { useRef, useEffect, useState } from 'react';
import { ErrorValues } from '../../types/ErrorVal/ErrorVal';

interface Props {
  creatTodo: (todo: Todo) => Promise<void>;
  loading: number[] | null;
  setLoading: (val: number[] | null) => void;
  showNewError: (str: string) => void;
}

export const Header: React.FC<Props> = ({
  creatTodo,
  loading,
  setLoading,
  showNewError,
}) => {
  const [title, setTitle] = useState('');

  const newTodoFieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoFieldFocus.current) {
      newTodoFieldFocus.current.focus();
    }
  }, [loading]);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showNewError(ErrorValues.Empty);
      setLoading(null);

      return;
    }

    const todo: Todo = {
      id: 0,
      userId: 901,
      completed: false,
      title: normalizeTitle,
    };

    try {
      setLoading([todo.id]);
      await creatTodo(todo);
      reset();
    } catch (error) {
    } finally {
      setLoading(null);
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

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoFieldFocus}
          value={title}
          disabled={!!loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
