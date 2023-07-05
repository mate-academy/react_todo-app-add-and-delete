import { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  handleAddingNewTodo: (handleAddingNewTodo: string) => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  todos, handleAddingNewTodo, isLoading,
}) => {
  const [newTodo, setNewTodo] = useState<string>('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddingNewTodo(newTodo);
    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      && <button type="button" className="todoapp__toggle-all active" />}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          disabled={isLoading}
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
