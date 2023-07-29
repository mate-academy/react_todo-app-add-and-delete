/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { memo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  preparedTodos: Todo[],
  setError: React.Dispatch<React.SetStateAction<ErrorType>>,
  addNewTodo: (value: string) => Promise<void>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
};

export const Header: React.FC<Props> = memo(({
  preparedTodos,
  setError,
  addNewTodo,
  setTempTodo,
}) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.length) {
      setError(ErrorType.EMPTY);
      setTimeout(() => setError(ErrorType.NONE), 3000);

      return;
    }

    setIsSubmitting(true);
    addNewTodo(value)
      .then(() => setValue(''))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: preparedTodos.some(todo => todo.completed),
        })}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
});
