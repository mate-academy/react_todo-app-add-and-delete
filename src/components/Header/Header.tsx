import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  mainInput: React.RefObject<HTMLInputElement>;
  handleSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  title,
  setTitle,
  mainInput,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() =>
            // eslint-disable-next-line @typescript-eslint/no-shadow
            setTodos(todos => {
              const allCompleted = todos.every(td => td.completed);

              return todos.map(todo => ({
                ...todo,
                completed: !allCompleted,
              }));
            })
          }
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={mainInput}
        />
      </form>
    </header>
  );
};
