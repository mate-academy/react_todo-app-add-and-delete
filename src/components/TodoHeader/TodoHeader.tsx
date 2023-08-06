/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[],
  setErrorMessage: (error: Errors) => void,
  updateTodo: (updatedTodo: Todo) => Promise<void>,
  addTodo: (inputValue: string) => Promise<void>,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setErrorMessage,
  updateTodo,
  addTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const headerInputFocus = useRef<HTMLInputElement | null>(null);

  // Autofocus on main input
  useEffect(() => {
    if (headerInputFocus.current) {
      headerInputFocus.current.focus();
    }
  }, [todos]);

  // Submition the form to add new Todo
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage(Errors.NO_TITLE);
      setTimeout(() => setErrorMessage(Errors.RESET), 3000);

      return;
    }

    setErrorMessage(Errors.RESET);
    setIsDisabledInput(true);

    addTodo(inputValue)
      .then(() => {
        setIsDisabledInput(false);
        setInputValue('');
      })
      .catch(() => setIsDisabledInput(false));
  };

  // Make all todos completed or uncompleted
  const completeAllTodos = async () => {
    const statusOfTodos = [...todos].every(todo => todo.completed);

    const updateTodos = statusOfTodos
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

    const newTodos = await Promise.all(updateTodos.map(todo => {
      return updateTodo({ ...todo, completed: !todo.completed });
    }));

    return newTodos;
  };

  // Activating the "Toggle All" button if all todos completed
  const allCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          onClick={completeAllTodos}
          className={classNames(
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
          ref={headerInputFocus}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
