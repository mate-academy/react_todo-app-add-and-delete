import { useState } from 'react';
import cn from 'classnames';

import { addTodo, updateTodo } from '../../api/todos';

import { useTodosContext } from '../../context/TodosContext';

import { temporaryTodo } from '../../utils/tempTodo';

import { AddTodoForm } from './AddTodoForm';

import { Todo } from '../../types/Todo';

export const Header = () => {
  const [title, setTitle] = useState('');
  const { todos, setTodos, setErrorMessage, setTempTodo, setLoadingIds } =
    useTodosContext();

  const isToggleButtonActive = todos.every(t => t.completed);
  const showToggleAll = todos.length > 0;

  function createNewTodo(currentTitle: string) {
    const newTodo: Todo = {
      ...temporaryTodo,
      title: currentTitle.trim(),
    };

    return newTodo;
  }

  function addNewTodo(newTodo: Todo) {
    addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(prev => [...prev, todoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingIds([]);
      });
  }

  function updatingTodo(todoForUpdate: Todo, updatedTodos: Todo[]) {
    updateTodo(todoForUpdate)
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds([]);
      });
  }

  const handleAddTodoAndSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = createNewTodo(title);

    setTempTodo(newTodo);
    setLoadingIds(prev => [...prev, 0]);

    addNewTodo(newTodo);
  };

  const handleToggleAllTodosStatus = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setLoadingIds(todos.map(todo => todo.id));

    await Promise.all(
      updatedTodos.map(todo => updatingTodo(todo, updatedTodos)),
    );
  };

  return (
    <header className="todoapp__header">
      {showToggleAll && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleButtonActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodosStatus}
        />
      )}
      <AddTodoForm
        submit={handleAddTodoAndSubmit}
        setTitle={setTitle}
        title={title}
      />
    </header>
  );
};
