import { useState, useRef, useEffect } from 'react';
import { TyChangeEvtInputElmt } from '../types/General';
import { Todo } from '../types/Todo';
import { ErrorTodo } from '../types/ErrorTodo';

type Props = {
  onAddTodo: (todo: Omit<Todo, 'id' | 'userId'>) => Promise<Todo | void>;
  onErrorCreate?: (errMsg: ErrorTodo) => void;
};

export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  onErrorCreate = () => { },
}) => {
  const [title, setTitle] = useState('');
  const titleInput = useRef<HTMLInputElement>(null);

  // #region HANDLER
  const handleInputChange = (event: TyChangeEvtInputElmt) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = title.trim();

    if (trimedTitle === '') {
      onErrorCreate(ErrorTodo.EMPTY_TITLE);

      return;
    }

    if (titleInput.current?.disabled) { // prevent double submit
      return;
    }

    if (titleInput.current) { // disable input on loading time
      titleInput.current.disabled = true;
    }

    onAddTodo({
      title: trimedTitle,
      completed: false,
    }).finally(() => {
      if (titleInput.current) {
        titleInput.current.disabled = false;
        titleInput.current.focus();
      }

      setTitle('');
    });
  };
  // #endregion

  // #region EFFECT
  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [titleInput]);
  // #endregion

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleInput}
          value={title}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
