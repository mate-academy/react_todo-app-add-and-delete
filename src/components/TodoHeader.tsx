import { useEffect, useRef } from 'react';
import { useTodos } from '../context/TodosProvider';
import { ErrorMessage } from '../types/Errors';
import { useAuthorize } from '../context/AutorizationProvider';
import { addTodos } from '../api/todos';
import { Todo } from '../types/Todo';

export const TodoHeader: React.FC = () => {
  const {
    todoTitle,
    setTodoTitle,
    setErrorMessage,
    errorMessage,
    setTodos,
    todos,
    loading,
    setLoading,
    setTempTodo,
  } = useTodos();

  const USER_ID = useAuthorize();

  const fieldRender = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldRender.current && !fieldRender.current.disabled) {
      fieldRender.current.focus();
    }
  }, [fieldRender, todos, errorMessage]);

  const handleSubmit = ((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    if (USER_ID) {
      setLoading(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });

      addTodos({ userId: USER_ID, title: todoTitle, completed: false })
        .then((newTodo: Todo) => {
          setTodoTitle('');
          const currentTodos = [...todos, newTodo];

          setTodos(currentTodos);
        })
        .catch(() => setErrorMessage(ErrorMessage.Add))
        .finally(() => {
          setLoading(false);

          setTempTodo(null);
        });
    }
  });

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      >
        {' '}
      </button>
      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          ref={fieldRender}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
        />
      </form>
    </header>
  );
};
