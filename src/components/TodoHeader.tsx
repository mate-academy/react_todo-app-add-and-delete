import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onTodoAddError: (errorMessage: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onTodoAdd,
  onTodoAddError,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onTitleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onFormSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preperedTodoTitle = todoTitle.trim();

    if (!preperedTodoTitle) {
      onTodoAddError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    onTodoAdd(todoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={todoTitle}
          onChange={onTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
