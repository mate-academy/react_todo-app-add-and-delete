import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTodosContext } from '../../utils/useTodosContext';
import { onErrors } from '../../utils/onErrors';
import { Errors } from '../../enums/Errors';
import { USER_ID, addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    setLoadingTodosIds,
    inputFocus,
    setInputFocus,
  } = useTodosContext();

  const todoInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);
  const allCompleted = useMemo(() => {
    return todos.every((todo: Todo) => todo.completed);
  }, [todos]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setTitle(event.target.value);
  };

  const createTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    setIsSubmited(true);

    if (!trimmedTitle.length) {
      onErrors(Errors.EmptyTitle, setErrorMessage);
      setIsSubmited(false);

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
    setLoadingTodosIds(prevTodosids => [...prevTodosids, tempTodo.id]);

    addTodo(newTodo)
      .then((resp: Todo) => {
        setTodos(currentTodos => [...currentTodos, resp]);
        setTitle('');
      })
      .catch(() => onErrors(Errors.AddTodo, setErrorMessage))
      .finally(() => {
        setTempTodo(null);
        setLoadingTodosIds([]);
        setIsSubmited(false);
        setInputFocus(true);
      });
  };

  useEffect(() => {
    if (inputFocus && todoInputRef.current) {
      todoInputRef.current?.focus();
      setInputFocus(false);
    }
  }, [inputFocus]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={createTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInputRef}
          value={title}
          onChange={handleInputChange}
          disabled={isSubmited}
        />
      </form>
    </header>
  );
};
