import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoResponse } from '../../types/TodoResponse';
import { postTodo } from '../../api/todos';
import { formatTodo } from '../../utils/formatResponse';

type Props = {
  todosToRender: Todo[];
  setTodosToRender: (arr: Todo[]) => void;
  pushError: (title: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setIsTempLoading: (val: boolean) => void;
  setTodos: (arr: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  todosToRender,
  setTodosToRender,
  pushError,
  setTempTodo,
  setIsTempLoading,
  setTodos,
}) => {
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [focus, setFocus] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  const onInputChange = (str: string) => {
    setValue(() => str);
  };

  // this would be handled using methods later
  const toggleAll = () => {
    if (todosToRender) {
      setTodosToRender([...todosToRender].map(todo => {
        return todosToRender.every(item => item.completed)
          ? {
            ...todo,
            completed: !todo.completed,
          }
          : {
            ...todo,
            completed: true,
          };
      }));
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) {
      pushError('Title can\'t be empty');

      return;
    }

    const rawTodo = {
      title: value,
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo({ id: 0, ...rawTodo });
    setIsTempLoading(true);

    postTodo({ ...rawTodo, userId: 10222 })
      .then(res => {
        setTodos([...todosToRender, {
          ...formatTodo(res as TodoResponse),
        }]);
        setValue('');
      })
      .catch(() => {
        pushError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        setFocus(true);
      });
  };

  useEffect(() => {
    if (focus) {
      refInput.current?.focus();
    }
  }, [focus]);

  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={`todoapp__toggle-all${todosToRender?.some(todo => !todo.completed) ? ' active' : ''}`}
        onClick={toggleAll}
        aria-label="Toggle all"
      />

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isDisabled}
          ref={refInput}
        />
      </form>
    </header>
  );
};
