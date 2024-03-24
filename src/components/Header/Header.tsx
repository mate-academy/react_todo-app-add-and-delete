import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import * as todoSevice from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  completedTodos: Todo[];
  activeTodos: Todo[];
  setError: (error: Errors) => void;
};
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  completedTodos,
  activeTodos,
  setError,
}) => {
  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const isClassActive = completedTodos.length > 0 && activeTodos.length === 0;
  const [title, setTitle] = useState('');
  const [isSubMit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (addTodoInputRef.current) {
      addTodoInputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(Errors.default);
    setTitle(event.target.value);
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmit(true);

    if (!title.trim().length) {
      setError(Errors.addTodo);
      setIsSubmit(false);
    } else {
      setError(Errors.default);
      const newTodo = {
        title: title.trim(),
        userId: todoSevice.USER_ID,
        completed: false,
      };

      todoSevice
        .createTodo(newTodo)
        .then((response: Todo) => {
          setTodos((prevTodos: Todo) => [...prevTodos, response]);
          setTitle('');
        })
        .catch(() => {
          setError(Errors.addTodo);
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  }

  return (
    <div>
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        {todos.length !== 0 && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isClassActive,
            })}
            data-cy="ToggleAllButton"
          />
        )}

        {/* Add a todo on form submit */}
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
