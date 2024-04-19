import React, { useContext, useEffect, useRef, useState } from 'react';
import { todosContext } from '../../Store';
import { USER_ID, addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { errorText } from '../../constants';
import { completedTodos } from '../../utils/utils';

export const Header: React.FC = () => {
  const { todos, setTodos, setErrorMessage, setTempTodo, loading, setLoading } =
    useContext(todosContext);
  const [title, setTitle] = useState('');
  const titleFild = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFild.current) {
      titleFild.current.focus();
    }
  }, [todos, loading]);

  const allTodosAreCompleted = completedTodos(todos).length === todos.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage(errorText.emptyTitle);

      return;
    }

    if (!loading) {
      const newTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: newTitle,
        completed: false,
      };

      setLoading(true);
      setErrorMessage('');
      setTempTodo(newTodo);

      addTodo(newTodo)
        .then(todo => {
          setTodos(prevTodos => {
            return [...prevTodos, { ...todo, loading: false }];
          });
        })
        .catch(error => {
          setErrorMessage(errorText.failAdding);
          throw error;
        })
        .then(() => setTitle(''))
        .finally(() => {
          setLoading(false);
          setTempTodo(null);
        });
    }
  }

  return (
    <header className="todoapp__header">
      {false && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleFild}
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
