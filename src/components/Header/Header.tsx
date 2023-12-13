import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todosFromServer: Todo[];
  createNewTodo: (title: string) => void;
}

export const Header = ({ todosFromServer, createNewTodo }: Props) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNewTodo(todoTitle);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="Toggle All"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todosFromServer.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
