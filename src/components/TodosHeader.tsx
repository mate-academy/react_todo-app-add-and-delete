import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from './TodosContext';
import { addTodos, updateTodos } from '../api/todos';
import { Todo } from '../types/Todo';

export const TodosHeader: React.FC = () => {
  const {
    DEFAULT_DATA,
    todosAfterFiltering,
    inputRef,
    todos,
    setTodos,
    setErrorMessage,
    setTodoIsLoading,
    setTodoEditIsLoading,
  } = useContext(TodosContext);

  const [newTodo, setNewTodo] = useState('');
  const isCompleted = todosAfterFiltering.every(todo => todo.completed);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [lastId, setLastId] = useState(-1);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodo.trim() || inputDisabled) {
      setErrorMessage('Title should not be empty');
    }

    setInputDisabled(true);
    DEFAULT_DATA.title = newTodo.trim();
    const newId = todos.length ? todos[todos.length - 1].id + 1 : 1;

    setLastId(newId);
    setTodoIsLoading(newId);
    setTodoEditIsLoading({ id: newId, ...DEFAULT_DATA });

    addTodos(DEFAULT_DATA)
      .then((data: Todo) => {
        setTodos((prev: Todo[]) => [...prev
          .filter(todo => todo.id !== lastId), data]);
        setNewTodo('');
        setTodoEditIsLoading(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTodoEditIsLoading(null);
      })
      .finally(() => {
        setInputDisabled(false);
        setTodoIsLoading(null);
      });
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  const toggleAll = () => {
    setTodos(() => {
      return todosAfterFiltering.map(todo => {
        const updatedTodo = { ...todo, completed: !isCompleted };

        updateTodos(updatedTodo)
          .catch(() => {
            setErrorMessage('Unable to update a todo');
          });

        return updatedTodo;
      });
    });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isCompleted },
        )}
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          ref={inputRef}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
