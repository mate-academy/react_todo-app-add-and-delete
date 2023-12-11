import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    handleSetError,
    isError,
    setTempTodo,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const addTodoQuery = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addTodoQuery.current) {
      addTodoQuery.current.focus();
    }
  }, [todos, query, isError]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    handleSetError(ErrorMessage.NOT_ERROR);
  };

  const handleAddNewTodo = async (
    { title, completed, userId }: Omit<Todo, 'id'>,
  ) => {
    try {
      setIsDisabled(true);
      const todoToAdd = await addTodo(userId, { title, completed, userId });

      setTodos([...todos, todoToAdd]);
    } catch {
      handleSetError(ErrorMessage.ON_ADD);
    } finally {
      setIsDisabled(false);
      setTempTodo(null);
      setQuery('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSetError(ErrorMessage.NOT_ERROR);

    if (!query.trim()) {
      handleSetError(ErrorMessage.ON_EMPTY);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    handleAddNewTodo(newTodo);
  };

  const isActiveButton = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="toggle-all"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isActiveButton,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={isDisabled}
          ref={addTodoQuery}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
        />
      </form>
    </header>
  );
};
