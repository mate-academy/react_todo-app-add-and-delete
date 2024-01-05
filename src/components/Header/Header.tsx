import React, {
  FC, useCallback, useMemo, useState,
} from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleError: (error: Errors) => void,
  addTodo: (inputValue: string) =>void,
  updateTodo: (updatedTodo: Todo) =>void,
  disabled: boolean,
};
export const Header: FC<Props> = (props) => {
  const {
    todos,
    handleError,
    addTodo,
    updateTodo,
    disabled,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const handleFocusOnInput = useCallback((input: HTMLInputElement) => {
    input?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      handleError(Errors.EmptyTitle);

      return;
    }

    try {
      addTodo(inputValue);

      setInputValue('');
    } catch (error) {
      handleError(Errors.AddTodo);
    }
  };

  const completeAllTodos = () => {
    const statusOfTodos = todos.every(todo => todo.completed);

    const updateTodos = todos
      .filter(todo => (!statusOfTodos ? !todo.completed : todo.completed));

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
          className={cn(
            'todoapp__new-todo',
            { disabled },
          )}
          placeholder="What needs to be done?"
          ref={handleFocusOnInput}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
