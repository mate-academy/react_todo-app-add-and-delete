import { FC, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo/Todo';
import { useTodoContext } from '../../context/TodoContext';
import { isAllTodosComplete } from '../../utils/helpers/filterService';
import { useTodoActions } from '../../utils/hooks/useTodoActions';
import { getuuidNumber } from '../../utils/uuidNumber';
import classNames from 'classnames';
import { useFocus } from '../../utils/hooks/useFocus';

export const Header: FC = ({}) => {
  const { showError, setLoadingTodoIds, todos, setTodoTemp, setLockedFocus } =
    useTodoContext();
  const { createTodo, toggleAllCompleted } = useTodoActions();
  const { inputRef } = useFocus();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // - тут стан для фокусу

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showError(ErrorMessages.Empty);
      setLoadingTodoIds(null);
      setLockedFocus(true);

      return;
    }

    setTodoTemp(normalizeTitle);

    const todo: Todo = {
      id: getuuidNumber(),
      userId: USER_ID,
      completed: false,
      title: normalizeTitle,
    };

    try {
      setLockedFocus(false);
      setIsSubmitting(true);
      setLoadingTodoIds([todo.id]);
      await createTodo(todo);
      reset();
    } catch {
      setTitle(normalizeTitle);
    } finally {
      setLoadingTodoIds(null);
      setTodoTemp(null);
      setIsSubmitting(false);
      setLockedFocus(true);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosComplete(todos),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
