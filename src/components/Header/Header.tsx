import React, {
  FC, useCallback, useMemo, useState,
} from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setErrorMessage: (error: Errors) => void,
  addTodo: (inputValue: string) => Promise<void>,
  updateTodo: (updatedTodo: Todo) => Promise<void>,
};
export const Header: FC<Props> = (props) => {
  const {
    todos,
    setErrorMessage,
    addTodo,
    updateTodo,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const handleFocusOnInput = useCallback((input: HTMLInputElement) => {
    input?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage(Errors.NO_TITLE);
      setTimeout(() => setErrorMessage(Errors.NULL), 3000);

      return;
    }

    setErrorMessage(Errors.NULL);
    setIsDisabledInput(true);

    addTodo(inputValue)
      .then(() => {
        setIsDisabledInput(false);
        setInputValue('');
      })
      .catch(() => setIsDisabledInput(false));
  };

  const completeAllTodos = async () => {
    const statusOfTodos = [...todos].every(todo => todo.completed);

    const updateTodos = statusOfTodos
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

    return Promise.all(updateTodos.map(todo => {
      return updateTodo({ ...todo, completed: !todo.completed });
    }));
  };

  const allCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          onClick={completeAllTodos}
          aria-label="all todos button"
          className={cn(
            'todoapp__toggle-all',
            { active: allCompleted },
          )}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          id="todoInput"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={handleFocusOnInput}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
