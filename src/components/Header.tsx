import { Todo } from '../types/Todo';
import * as service from '../api/todos';
import classNames from 'classnames';

type Props = {
  todo: Todo | null;
  onAddTodo: (todo: Todo) => Promise<void>;
  title: string;
  setTitle: (title: string) => void;
  handleError: (msg: string) => void;
  onReset: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isSubmiting: boolean;
  setIsSubmiting: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todo,
  onAddTodo,
  title,
  setTitle,
  handleError,
  onReset,
  inputRef,
  isSubmiting,
  setIsSubmiting,
}) => {
  const handlSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimed = title.trim();

    if (!trimed) {
      handleError('Title should not be empty');

      return;
    }

    setIsSubmiting(true);
    onAddTodo({
      id: 0,
      userId: service.USER_ID,
      title: trimed,
      completed: false,
    })
      .then(() => {
        onReset();
      })
      .finally(() => setIsSubmiting(false));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todo?.completed,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handlSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-loading': isSubmiting,
          })}
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isSubmiting}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={e => {
            if (!e.target.value && !isSubmiting) {
              handleError('Title should not be empty');
            }
          }}
        />
      </form>
    </header>
  );
};
