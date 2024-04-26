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
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  todoTitle,
  setTodoTitle,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
  setTempTodo,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });
  const completedTodos = todos.every(todo => todo.completed);

  function addTodo(title: string) {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');

    const createdTempTodo = { id: 0, title: title, completed: false };

    setTempTodo(createdTempTodo);
    setLoadingTodoIds(prevTodoIds => [...prevTodoIds, createdTempTodo.id]);

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
        setTodoTitle('');
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== createdTempTodo.id),
        );
        setTempTodo(null);
        if (titleField.current) {
          titleField.current.focus();
        }
      });
  }

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => {
      return { ...todo, completed: !todo.completed };
    });

    updatedTodos.forEach(todo => {
      setLoadingTodoIds(prevIds => [...prevIds, todo.id]);
      setTimeout(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== todo.id),
        );
      }, 500);
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
          active: completedTodos,
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
          disabled={loadingTodoIds.length > 0}
        />
      </form>
    </header>
  );
};
