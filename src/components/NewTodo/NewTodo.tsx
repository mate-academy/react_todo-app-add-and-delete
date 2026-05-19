import cn from 'classnames';
import { TodoItem } from '../../types/Todo';
import { useState, useEffect } from 'react';
import { USER_ID } from '../../api/todos';
import { addTodo } from '../../api/todos';

type Props = {
  allCompleted: boolean;
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
  setErrorMessage: (message: string) => void;
  setTempTodo: (todo: TodoItem | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({
  allCompleted,
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
  inputRef,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<TodoItem, 'id'> = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    setIsLoading(true);

    addTodo(newTodo)
      .then(addedTodo => {
        setTodos([...todos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
