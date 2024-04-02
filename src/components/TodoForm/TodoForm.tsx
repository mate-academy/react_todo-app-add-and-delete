import { useEffect, useRef, useState } from 'react';
import { Errors } from '../../enums/Errors';
import { useTodosContext } from '../../helpers/useTodoContext';
import classNames from 'classnames';
import { USER_ID, addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { getErrors } from '../../helpers/getErorrs';

export const TodoForm = () => {
  const {
    todos,
    setTodos,
    completedTodos,
    activeTodos,
    setErrorMessage,
    setTempTodo,
    setLoadingTodoIds,
    loadingTodoIds,
    shouldFocus,
    setShouldFocus,
  } = useTodosContext();
  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const isClassActive = completedTodos.length > 0 && activeTodos.length === 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setTitle(event.target.value);
  };

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      getErrors(Errors.EmptyTitle, setErrorMessage);

      return;
    }

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    const tempTodo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(tempTodo);
    setLoadingTodoIds(prevLoadingTodoIds => [
      ...prevLoadingTodoIds,
      tempTodo.id,
    ]);

    addTodos(newTodo)
      .then((resp: Todo) => {
        setTodos((prev: Todo[]) => [...prev, resp]);
        setTitle('');
      })
      .catch(() => getErrors(Errors.AddTodo, setErrorMessage))
      .finally(() => {
        setLoadingTodoIds([]);
        setTempTodo(null);
        setShouldFocus(true);
      });
  };

  useEffect(() => {
    if (shouldFocus && addTodoInputRef.current) {
      addTodoInputRef.current.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isClassActive,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="todo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          ref={addTodoInputRef}
          disabled={loadingTodoIds.length > 0}
        />
      </form>
    </header>
  );
};
