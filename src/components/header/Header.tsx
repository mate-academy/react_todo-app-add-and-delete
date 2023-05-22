import { FormEvent, useState } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  setError: (errText: string) => void;
  handleSetTempTodo: (todo: Todo | null) => void;
  updateTodos: (todo: Todo) => void;
  userId: number;
}

export const Header: React.FC<Props> = ({
  userId,
  setError,
  handleSetTempTodo,
  updateTodos,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputValue) {
      setError('Title can not be empty');

      return;
    }

    setIsLoading(true);
    handleSetTempTodo({
      id: 0,
      userId: 10283,
      title: inputValue,
      completed: false,
    });

    try {
      await addTodo({
        title: inputValue,
        userId,
        completed: false,
      }).then(response => updateTodos(response as Todo));
    } catch {
      setError('can not add a todo');
    }

    setIsLoading(false);
    handleSetTempTodo(null);
    setInputValue('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle All Todos"
      />

      <form onSubmit={handleAddTodo}>
        <input
          disabled={isLoading}
          value={inputValue}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => {
            setInputValue(event.target.value);
            setError('');
          }}
        />
      </form>
    </header>
  );
};
