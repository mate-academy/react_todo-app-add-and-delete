import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useNewTodo } from '../../hook/useNewTodo';

type Props = {
  filteredTodos: Todo[];
  error: string;
  setError: (value: string) => void;
  setTodos: (fn: SetTodosFuncion) => void;
  setTempTodo: (tempTask: Todo | null) => void;
};

type SetTodosFuncion = (todo: Todo[]) => Todo[];

export const Header: React.FC<Props> = ({
  filteredTodos,
  error,
  setError,
  setTodos,
  setTempTodo,
}) => {
  const {
    title,
    isLoading,
    inputRef,
    handleTitle,
    handleNewTodo,
    hasAllTodosCompleted,
  } = useNewTodo({ filteredTodos, error, setError, setTodos, setTempTodo });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: hasAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={event => handleNewTodo(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => handleTitle(event)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
