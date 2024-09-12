import React, { useContext, useEffect, useRef, useState } from 'react';
import { TodosContext } from './TodosContext';
import { TEMPORARY_TODO_ID, USER_ID, addTodo } from '../api/todos';
import classNames from 'classnames';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setMessageError,
    messageError,
    loadingTodo,
    setLoadingTodo,
  } = useContext(TodosContext);
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, todoTitle, messageError]);

  const AddNewTodo = (
    title: string,
    completed = false,
    userId = USER_ID,
  ): Promise<void> => {
    setMessageError(Errors.NoError);

    setLoadingTodo([TEMPORARY_TODO_ID]);

    // quick fix to show lockal new todo, then this todo will change to a todo
    // with normal id that create an API (I don't know how to do it better)
    setTodos([
      ...todos,
      {
        title: title,
        completed: false,
        userId: USER_ID,
        id: TEMPORARY_TODO_ID,
      },
    ]);

    return addTodo({ title, completed, userId })
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(error => {
        setMessageError(Errors.CantAdd);
        setTodos(todos.filter(todo => todo.id !== TEMPORARY_TODO_ID));
        hideError(setMessageError);
        throw error;
      })
      .finally(() => {
        setLoadingTodo([]);
      });
  };

  const handleSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setMessageError(Errors.EmptyTitle);
      hideError(setMessageError);

      return;
    }

    AddNewTodo(todoTitle.trim()).then(() => setTodoTitle(''));
  };

  const isAllComplited = todos.every(todo => todo.completed);

  const handleAllComplited = () => {
    const allComplited = todos.map(todo => {
      if (isAllComplited) {
        return { ...todo, completed: !todo.completed };
      }

      return { ...todo, completed: true };
    });

    setTodos(allComplited);
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllComplited,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllComplited}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={loadingTodo.length !== 0}
          value={todoTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
