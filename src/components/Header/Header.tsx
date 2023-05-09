import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
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
      userId: 10222,
      completed: false,
    };
    const postTodoPromise = postTodo(rawTodo);

    setIsDisabled(true);
    setTempTodo({ id: 0, ...rawTodo });
    setIsTempLoading(true);

    postTodoPromise.then(res => {
      setTodos([...todosToRender, {
        ...formatTodo(res),
      }]);
      setTempTodo(null);
      setIsDisabled(false);
      setValue('');
    }).catch(() => {
      pushError('Unable to add a todo');
      setIsDisabled(false);
      setTempTodo(null);
    });
  };

  return (
    <header className="todoapp__header">

      {/* this buttons is active only if there are some active todos */}
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
        />
      </form>
    </header>
  );
};
