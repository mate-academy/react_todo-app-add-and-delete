import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import * as todoSevice from '../../api/todos';
import { Errors } from '../../types/Errors';
import { handleRequestError } from '../../utils/handleRequestError';
import { useTodosContext } from '../../utils/useTodosContext';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    setError,
    loadingTodoIds,
    setLoadingTodoIds,
    activeTodos,
    completedTodos,
  } = useTodosContext();
  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const isClassActive = completedTodos.length > 0 && activeTodos.length === 0;
  const [title, setTitle] = useState('');
  const [isSubMit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (loadingTodoIds && addTodoInputRef.current) {
      addTodoInputRef.current.focus();
    }
  }, [loadingTodoIds]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(Errors.default);
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmit(true);

    if (!title.trim().length) {
      handleRequestError(Errors.emptyTitle, setError);
      setIsSubmit(false);
    } else {
      const newTodo = {
        title: title.trim(),
        userId: todoSevice.USER_ID,
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
      todoSevice
        .createTodo(newTodo)
        .then((response: Todo) => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, response]);
          setTitle('');
        })
        .catch(() => {
          handleRequestError(Errors.addTodo, setError);
        })

        .finally(() => {
          setIsSubmit(false);
          setTempTodo(null);
          setLoadingTodoIds(prevLoadingTodoIds =>
            prevLoadingTodoIds.filter(id => id !== tempTodo.id),
          );
        });
    }
  };

  return (
    <div>
      <header className="todoapp__header">
        {todos.length !== 0 && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isClassActive,
            })}
            data-cy="ToggleAllButton"
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={handleInputChange}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={addTodoInputRef}
            disabled={isSubMit}
          />
        </form>
      </header>
    </div>
  );
};
