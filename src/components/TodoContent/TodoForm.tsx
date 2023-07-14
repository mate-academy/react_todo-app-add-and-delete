/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, FormEvent, useContext, useState, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../TodoContext';
import { ErrorType } from '../../types/ErrorType';

export const TodoForm: FC = () => {
  const [todoTitle, setTodoTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFirstRender = useRef(true);

  const {
    todosCount,
    activeTodosLeft,
    isLoading,
    error,
    onAddNewTodo,
    onErrorChange,
  } = useContext(TodoContext);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoTitle, error]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      onErrorChange(ErrorType.EmptyTitle);

      return;
    }

    const todoIsCreated = await onAddNewTodo(todoTitle);

    if (todoIsCreated) {
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosLeft === 0,
          })}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
