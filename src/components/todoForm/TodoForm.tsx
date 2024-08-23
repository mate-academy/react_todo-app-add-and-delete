import classNames from 'classnames';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  addTodoToTodoList: (todo: Todo) => Promise<void>;
  isLoading: boolean;
}

export const TodoForm: FC<Props> = ({
  todos,
  setErrorMessage,
  addTodoToTodoList,
  isLoading,
}) => {
  const [todoValue, setTodoValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const completedTodos = todos.filter(todo => todo.completed).length;
  const trimmedTodoValue = todoValue.trim();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTodoValue) {
      setErrorMessage('Title should not be empty');

      return;
    }

    try {
      await addTodoToTodoList({
        id: 0,
        title: trimmedTodoValue,
        completed: false,
        userId: 1305,
      });

      setTodoValue('');
    } catch (error) {
    } finally {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completedTodos === todos.length,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
