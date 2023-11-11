/* eslint-disable jsx-a11y/control-has-associated-label */

import {
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';

import { TodosContext } from '../TodoContext/TodoContext';
import { ErrorMessage } from '../../types/Error';
import { USER_ID } from '../../utils/UserID';

export const TodoHeader = () => {
  const [newTitle, setNewTitle] = useState('');
  const {
    addCurrentTodo,
    setErrorMessage,
    isLoading,
    setIsLoading,
  } = useContext(TodosContext);

  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFocus.current && !isLoading) {
      titleFocus.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorMessage.None);

    if (!newTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsLoading(true);

    addCurrentTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(() => setNewTitle(''))
      .catch(() => setIsLoading(false))
      .finally(() => setIsLoading(false));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={titleFocus}
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
