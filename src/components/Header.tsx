import React, { useContext, useEffect, useRef, useState } from 'react';
import { TodosContext } from './TodosContext';
import { USER_ID, addTodo } from '../api/todos';
import classNames from 'classnames';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setMessageError,
    loading,
    setLoading,
    setLoadingTodo,
  } = useContext(TodosContext);
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, todoTitle]);

  const AddNewTodo = (title: string, completed = false, userId = USER_ID) => {
    if (!title.trim()) {
      setMessageError(Errors.EmptyTitle);
      hideError(setMessageError);

      return;
    }

    setMessageError(Errors.NoError);

    setLoading(true);

    // quick fix to show lockal new todo, then this todo will change to a todo
    // with normal id that create an API (I don't know how to do it better)
    setLoadingTodo(123456789);
    setTodos([
      ...todos,
      { title: title, completed: false, userId: USER_ID, id: 123456789 },
    ]);

    addTodo({ title, completed, userId })
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(error => {
        setMessageError(Errors.CantAdd);
        hideError(setMessageError);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodo(null);
        setTodoTitle('');
      });
    // addTodo({ title, completed, userId })
    //   .then(newTodo => setTodos([...todos, newTodo]))
    //   .catch(error => {
    //     setMessageError(Errors.CantAdd);
    //     hideError(setMessageError);
    //     throw error;
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     setTodoTitle('');
    //   });
  };

  const handleSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    AddNewTodo(todoTitle.trim());
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
          disabled={loading}
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
