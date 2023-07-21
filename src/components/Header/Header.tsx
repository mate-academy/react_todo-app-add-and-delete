import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { createTodo, getTodos, updateComplete } from '../../api/todos';
import { Error, Filter, Todo } from '../../types/todo';
import { filterTodos } from '../../utils/helpers';

type Props = {
  userId: number;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: Filter;
  setHasError: (value: Error) => void;
};

export const Header: React.FC<Props> = ({
  userId,
  todos,
  setTodos,
  filter,
  setHasError,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isBtnActive = todos.every(todo => todo.completed);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todoTitle.trim().length) {
      setHasError(Error.Empty);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: todoTitle,
      completed: false,
      userId,
    };

    setIsLoading(true);

    createTodo(newTodo).then(() => {
      getTodos(userId)
        .then(data => {
          const newTodos = filterTodos(filter, data);

          setTodos(newTodos);
          setTodoTitle('');
          setIsLoading(false);
        });
    })
      .catch(() => {
        setHasError(Error.Add);
        setIsLoading(false);
      });
  };

  const togglerAllCompleteHandler = () => {
    todos.forEach(todo => {
      updateComplete(todo.id, { completed: !isBtnActive })
        .then(() => {
          setTodos(todos.map(t => ({
            ...t,
            completed: !isBtnActive,
          })));
        })
        .catch(() => {
          setHasError(Error.Update);
        });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isBtnActive,
          })}
          onClick={togglerAllCompleteHandler}
        />
      )}

      <form onSubmit={submitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
