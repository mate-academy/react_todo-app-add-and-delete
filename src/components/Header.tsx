/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  addTodo: (value: Todo) => void,
  isAdding: boolean,
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  setNewTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
};

export const Header: React.FC<Props> = ({
  addTodo,
  isAdding,
  setIsAdding,
  setIsError,
  setErrorText,
  setNewTodo,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsAdding(true);

    if (!query.trim()) {
      setIsAdding(false);
      setIsError(true);
      setErrorText("Title can't be empty");
      setTimeout(() => setErrorText(''), 3000);
    }

    if (query.trim() && user) {
      setErrorText('');
      setNewTodo({
        id: 0,
        userId: user.id,
        title: query,
        completed: false,
      });

      createTodo(query, user.id)
        .then(result => {
          addTodo({
            ...result,
          });
        })
        .catch(() => {
          setIsError(true);
          setErrorText('Unable to add a todo');
          setTimeout(() => setErrorText(''), 3000);
        })
        .finally(() => {
          setQuery('');
          setIsAdding(false);
          setNewTodo(null);
        });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isAdding}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
