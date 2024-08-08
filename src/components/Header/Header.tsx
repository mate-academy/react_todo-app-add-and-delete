import { FC, useState, useEffect } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo/Todo';
import { useTodoContext } from '../../utils/hooks/useTodoContext';
import { isAllTodosComplete } from '../../services/FilterService';
import { TodoService } from '../../services/TodoService';
import { getuuidNumber } from '../../utils/uuidNumber';
import classNames from 'classnames';

export const Header: FC = ({}) => {
  const { showError, setLoading, todos, inputRef, setTodoTemp, setFocusInput } =
    useTodoContext();
  const { createTodo, toggleAllCompleted } = TodoService();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setLoading(null);
      setFocusInput(true);

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
      setIsSubmitting(true);
      setLoading([todo.id]);
      await createTodo(todo);
      reset();
    } catch (error) {
    } finally {
      setLoading(null);
      setTodoTemp(null);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting, inputRef]);

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
