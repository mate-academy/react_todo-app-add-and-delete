import { TodosForm } from './TodosForm';
import { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  addPost: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  addPost,
  setErrorMessage,
  setIsLoading,
  isLoading,
  inputRef,
}) => {
  const [query, setQuery] = useState('');

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <TodosForm
        query={query}
        setQuery={setQuery}
        addPost={addPost}
        setErrorMessage={setErrorMessage}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        inputRef={inputRef}
      />
    </header>
  );
};
