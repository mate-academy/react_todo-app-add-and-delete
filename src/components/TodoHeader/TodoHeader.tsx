import './TodoHeader.scss';
import React, { useState } from 'react';
import { ErrorState } from '../../types/ErrorState';
import { createTodo, USER_ID } from '../../api/todos';
import { NewTodo } from '../../types/NewTodo';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  userInput: string;
  onFieldChange: (value: string) => void;
  onError: (error: ErrorState) => void;
  onCreateTodo: (todo: Todo | null) => void;
  onCreateTodoSuccess: (todos: Todo[]) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
}

export const TodoHeader = ({
  todos,
  userInput,
  onFieldChange,
  onError,
  onCreateTodo,
  onCreateTodoSuccess,
  newTodoField,
}: Props) => {
  const [isloading, setIsloading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userInput.length === 0 || userInput.trim().length === 0) {
      onError({
        message: 'Title should not be empty',
        isVisible: true,
      });

      return;
    }

    setIsloading(true);

    const normalizedInput = userInput.trim();

    const newTodo: NewTodo = {
      title: normalizedInput,
      userId: USER_ID,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    };

    onCreateTodo(tempTodo);

    try {
      const createdTodo = (await createTodo(newTodo)) as Todo;

      onCreateTodoSuccess([...todos, createdTodo]);
      onFieldChange('');
    } catch {
      onError({
        message: 'Unable to add a todo',
        isVisible: true,
      });
    } finally {
      onCreateTodo(null);
      setIsloading(false);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isloading}
          ref={newTodoField}
          onChange={handleFieldChange}
          value={userInput}
        />
      </form>
    </header>
  );
};
