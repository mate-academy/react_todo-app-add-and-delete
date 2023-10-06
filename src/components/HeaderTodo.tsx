import { FormEventHandler } from 'react';
import cn from 'classnames';
import { useTodo } from '../providers/AppProvider';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/fetchClient';

export const HeaderTodo = () => {
  const {
    todos,
    setTodos,
    title,
    setTitleContext,
    addTodoContext,
    setError,
    isDisabled,
    setEditedTodo,
  
  } = useTodo();

  const completeAllTodos = () => {
    setTodos((prev: Todo[]) => {
      if (prev.some(v => !v.completed)) {
        return prev.map(v => ({ ...v, completed: true }));
      }

      return prev.map(v => ({ ...v, completed: false }));
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  /* eslint-disable-next-line */
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    if (event.key === 'Enter') {
      if (title.trim() === '') {
        setError('Title should not be empty');

        return;
      }

      setEditedTodo(newTodo);
      addTodoContext(newTodo);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {todos.length !== 0 && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
          onClick={completeAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className={cn('todoapp__new-todo', {
            // 'disabled': isDisabled,
          })}
          disabled={isDisabled}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitleContext(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          ref={(myInput) => myInput && myInput.focus()}
        />
      </form>
    </header>
  );
};
