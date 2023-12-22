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
};
export const Header: FC<Props> = (props) => {
  const {
    todos,
    handleError,
    addTodo,
    updateTodo,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const handleFocusOnInput = useCallback((input: HTMLInputElement) => {
    input?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      handleError(Errors.EmptyTitle);

      return;
    }

    setIsDisabledInput(true);

    try {
      addTodo(inputValue);

      setInputValue('');
    } finally {
      setIsDisabledInput(false);
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
