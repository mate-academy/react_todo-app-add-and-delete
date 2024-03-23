import React, { useEffect, useRef } from 'react';

import { useTodos } from '../../hooks/useTodos';
import { USER_ID, addTodo } from '../../api/todos';

const TodoInput: React.FC = () => {
  const [isAllCompleted, setIsAllCompleted] = React.useState(false);

  const {
    setTodos,
    setError,
    isLoading,
    setIsLoading,
    setTempTodo,
    handleError,
    isAllDeleted,
  } = useTodos();

  const [newTodoTitle, setNewTodoTitle] = React.useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isAllDeleted]);

  const hangleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
    setError('');
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) {
      handleError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    });

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setIsLoading(true);

    addTodo(newTodo)
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleEnterEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTodo();
    }
  };

  const handleToggleAll = () => {
    setTodos(pervTodos =>
      pervTodos.map(todo => ({ ...todo, completed: !isAllCompleted })),
    );
    setIsAllCompleted(!isAllCompleted);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle all active todos"
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form>
        <input
          value={newTodoTitle}
          ref={inputRef}
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          onChange={hangleInputChange}
          onKeyDown={handleEnterEvent}
        />
      </form>
    </header>
  );
};

export default TodoInput;
