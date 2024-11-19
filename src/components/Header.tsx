/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, updateTodo } from '../api/todos';

interface HeaderProps {
  todos: Todo[];
  setEditingTodosId: (ids: number[]) => void;
  setError: (error: string) => void;
  editingTodosId: number[];
  setTodos: (todos: Todo[]) => void;
  setFilteredTodos: (todos: Todo[]) => void;
  filteredTodos: Todo[];
}

export function Header({
  todos,
  setEditingTodosId,
  setTodos,
  setFilteredTodos,
  setError,
  editingTodosId,
}: HeaderProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingNewTodo, setIsAddingNewTodo] = useState(false);

  const inputNewTodo = useRef<HTMLInputElement>(null);

  function handleNewTodoTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTodoTitle(e.target.value);
  }

  function handleAddNewTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      inputNewTodo.current?.focus();

      return;
    }

    const newTodoIdAvailable = todos.length
      ? todos[todos.length - 1].id + 1
      : 1;

    const newTodo = {
      title: trimmedTitle,
      completed: false,
      id: newTodoIdAvailable,
    };

    setIsAddingNewTodo(true);
    setEditingTodosId([...editingTodosId, newTodoIdAvailable]);

    const updatedTodos = [...todos, newTodo as Todo];

    setFilteredTodos(updatedTodos);

    addTodo(trimmedTitle)
      .then(responseFromAddedTodo => {
        const finalTodos = updatedTodos
          .filter(t => t.id !== newTodoIdAvailable)
          .concat(responseFromAddedTodo);

        setTodos(finalTodos);
        setFilteredTodos(finalTodos);
        setNewTodoTitle('');
      })
      .catch(() => {
        setFilteredTodos(todos);
        setError('Unable to add a todo');
      })
      .finally(() => {
        setEditingTodosId(
          editingTodosId.filter(id => id !== newTodoIdAvailable),
        );
        setIsAddingNewTodo(false);
      });
  }

  function handleToggleAllTodos() {
    const successfulUpdatedTodo: number[] = [];
    const hasAllCompleted = todos.every(t => t.completed);
    const todosToUpdate = hasAllCompleted
      ? todos
      : todos.filter(t => !t.completed);

    setEditingTodosId([...editingTodosId, ...todosToUpdate.map(t => t.id)]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo({
        ...todo,
        completed: !todo.completed,
      })
        .then(res => {
          successfulUpdatedTodo.push(res.id);
        })
        .catch(() => {
          setError('Unable to update todo');
        }),
    );

    Promise.all(updatePromises).then(() => {
      const newTodosUpdated = todos.map(t =>
        successfulUpdatedTodo.includes(t.id)
          ? { ...t, completed: !t.completed }
          : t,
      );

      setTodos(newTodosUpdated);
      setFilteredTodos(newTodosUpdated);
      setEditingTodosId([]);
    });
  }

  useEffect(() => {
    inputNewTodo.current?.focus();
  }, [todos.length, isAddingNewTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          onClick={() => handleToggleAllTodos()}
          className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={e => handleAddNewTodo(e)}>
        <input
          disabled={isAddingNewTodo}
          ref={inputNewTodo}
          data-cy="NewTodoField"
          type="text"
          onChange={e => handleNewTodoTitle(e)}
          className="todoapp__new-todo"
          value={newTodoTitle}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
}
