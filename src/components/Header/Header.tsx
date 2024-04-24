import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import * as todosService from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoTitle: string;
  setTodoTitle: (newTitle: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  loading: boolean;
  setLoading: (loadingStatus: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  todoTitle,
  setTodoTitle,
  setErrorMessage,
  loading,
  setLoading,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);
  const allTodosCompleted = todos.every(todo => todo.completed);

  function addTodo(title: string) {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setLoading(true);

    return todosService
      .postTodo({
        userId: todosService.USER_ID,
        title: title,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(`Unable to add a todo`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => {
      return { ...todo, completed: !todo.completed };
    });

    setTodos(updatedTodos);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo(todoTitle);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
