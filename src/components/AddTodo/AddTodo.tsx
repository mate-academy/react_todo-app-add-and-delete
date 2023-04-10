import {
  ChangeEvent, FC, FormEvent, useState,
} from 'react';
import classNames from 'classnames';

interface AddTodoProps {
  onDisable: boolean;
  onAddTodo: (query: string) => void;
  activeTodosCount: number
}

export const AddTodo: FC<AddTodoProps> = ({
  onAddTodo,
  onDisable,
  activeTodosCount,
}) => {
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosCount,
        })}
        aria-label="all"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={onDisable}
        />
      </form>
    </header>
  );
};
