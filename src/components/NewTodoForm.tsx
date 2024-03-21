import React, { useContext, useEffect, useState } from 'react';

import {
  ErrorContext,
  TempTodoContext,
  TodosContext,
} from '../providers/TodosProvider';

import { normalizeSpaces } from '../utils/normalize';
import { createTodo } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { FocusContext } from '../providers/FocusProvider';

type Props = {};

export const NewTodoForm: React.FC<Props> = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setErrorMessage } = useContext(ErrorContext);
  const { setTodos } = useContext(TodosContext);
  const { setTempTodo } = useContext(TempTodoContext);
  const { inputRef, setFocus } = useContext(FocusContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFocus();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [setFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedTitle = normalizeSpaces(todoTitle);

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const tempTodo = {
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempTodo);

    createTodo({ title: normalizedTitle, completed: false, userId: USER_ID })
      .then(newPost => {
        setTodos(prevTodos => {
          return [...prevTodos, newPost];
        });
        setTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          setFocus();
        }, 0);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </form>
  );
};
