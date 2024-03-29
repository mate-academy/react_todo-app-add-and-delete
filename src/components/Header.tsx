import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};
export const Header: React.FC<Props> = ({
  setError,
  todos,
  setTodos,
  setTempTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const [selectAllTodos, setSelectAllTodos] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const selectAllTasks = () => {
    const allTodos = todos.map(todo => ({
      ...todo,
      completed: !selectAllTodos,
    }));

    setTodos(allTodos);
    setSelectAllTodos(!selectAllTodos);
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  function addTodo({ title, userId, completed }: Todo) {
    const newTempTodo: Todo = {
      id: Math.random(),
      userId: todoService.USER_ID,
      completed: false,
      title,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);

    todoService
      .createTodo({ title, userId, completed })
      .then(newTodos => {
        setTodos(currentTodos => [...currentTodos, newTodos]);
        setTitleTodo('');
        setTempTodo(null);
        setError('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setIsAdding(false);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleTodo.trim()) {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      const newTodo = {
        title: titleTodo,
        userId: todoService.USER_ID,
        completed: false,
        id: 0,
      };

      addTodo(newTodo);
      setError('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all ', {
          active: selectAllTodos,
        })}
        data-cy="ToggleAllButton"
        onClick={selectAllTasks}
      />

      {/* Add a todo on form submit */}
      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={titleTodo}
          onChange={e => {
            setTitleTodo(e.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
