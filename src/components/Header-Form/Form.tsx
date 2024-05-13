import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  activeInput: React.RefObject<HTMLInputElement>;
  onSubmit: (todo: Todo) => Promise<void>;
  setErrorMessage: (error: ErrorType | null) => void;
};

export const Form: React.FC<Props> = ({
  activeInput,
  onSubmit,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const reset = () => {
    setTitle('');
  };

  const onCreateTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onAddNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorType.EmptyTitle);

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    title.trim();

    setIsSubmiting(true);
    onSubmit({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(reset)
      .finally(() => setIsSubmiting(false));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form method="POST" onSubmit={onAddNewTodo}>
        <input
          ref={activeInput}
          value={title}
          onChange={onCreateTodo}
          disabled={isSubmiting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
