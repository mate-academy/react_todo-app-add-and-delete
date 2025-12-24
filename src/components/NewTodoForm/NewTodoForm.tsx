import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { StateSetter } from '../../types/StateSetter';
import { createTodo, USER_ID } from '../../api/todos';

interface Props {
  setTodos: StateSetter<Todo[]>;
  setError: (msg: string) => void;
  setDisappearingError: (msg: string, timeout?: number) => void;
  setTempTodo: StateSetter<Todo | null>;
  todos: Todo[];
}

export const NewTodoForm: React.FC<Props> = ({
  setTodos,
  setError,
  setDisappearingError,
  setTempTodo,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setDisappearingError('Title should not be empty');
      setSubmitting(false);
      setTimeout(() => setError(''), 3000);

      return;
    }

    const newTodoData = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodoData });
    createTodo({ ...newTodoData })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setDisappearingError('Unable to add a todo'))
      .finally(() => {
        setSubmitting(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    if (!submitting) {
      newTodoField.current?.focus();
    }
  }, [submitting, todos.length]);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="NewTodoField"
        name="title"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={newTodoField}
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={submitting}
      />
    </form>
  );
};
