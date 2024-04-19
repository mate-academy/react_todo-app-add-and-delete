import cn from 'classnames';
import { Todo } from './types/Todo';
import { useEffect, useRef } from 'react';
import { getTodos, patchTodo } from './api/todos';

type Props = {
  isLoading: number | null;
  handleSubmit: (event: React.FormEvent) => void;
  setTodos: (todos: Todo[]) => void;
  setNewTitle: (val: string) => void;
  setIsLoading: (number: number | null) => void;
  newTitle: string;
  todos: Todo[];
};

export const Header = ({
  setIsLoading,
  setTodos,
  isLoading,
  handleSubmit,
  newTitle,
  setNewTitle,
  todos,
}: Props) => {
  const selectInputTitle = useRef<HTMLInputElement>(null);
  const isAllActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (selectInputTitle.current) {
      selectInputTitle.current.focus();
    }
  }, [isLoading]);

  const handleChangeCompleted = async () => {
    try {
      todos.map(todo => {
        setIsLoading(todo.id);
        patchTodo({
          ...todo,
          completed: true,
        });
      });

      await getTodos().then(setTodos);
    } catch (error) {
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all ', { active: isAllActive })}
        data-cy="ToggleAllButton"
        onClick={handleChangeCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={selectInputTitle}
          value={newTitle}
          disabled={isLoading !== null}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
