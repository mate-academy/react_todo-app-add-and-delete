/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from '../../UserWarning';
import { TodoContext } from '../TodoContext';
import * as todosService from '../../services/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { TodoErrorNotification } from '../TodoErrorNotification';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

const USER_ID = 11708;

export const TodoApp: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [setTodos, query, todos]);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.UnableLoad);
      });
  }, [setTodos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTodoData = {
      userId: USER_ID,
      title: trimmedQuery,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodoData,
    });

    setLoading(true);

    const createNewTodo = todosService.creatTodo(newTodoData);

    createNewTodo
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessage.UnableTodo);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

    const deletePromise = todosService.deleteTodo(todoId);

    deletePromise.catch(() => {
      setTodos(todos);
      setError(ErrorMessage.UnableDelete);
    });
  };

  const deleteAllCompleted = () => {
    const copyTodo = [...todos];

    setTodos(copyTodo.filter(todo => !todo.completed));

    copyTodo.filter(({ completed }) => completed)
      .map(({ id }) => id)
      .forEach((id) => {
        todosService.deleteTodo(id).catch(() => {
          setTodos(todos);
          setErrorMessage(ErrorMessage.UnableDelete);
        });
      });
  };

  const allTodosActive = todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {!!todos.length && (
            // eslint-disable-next-line
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allTodosActive,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={addTodo}>
            <input
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList onDeleteTodo={deleteTodo} />
        )}

        {tempTodo && (
          <TodoItem todo={tempTodo} todoDeleteButton={deleteTodo} />
        )}

        {!!todos.length && (
          <TodoFooter deleteAllCompleted={deleteAllCompleted} />
        )}
      </div>

      {!!errorMessage.length && (
        <TodoErrorNotification
          errorMessage={errorMessage}
          closeWindow={() => setErrorMessage('')}
        />
      )}
    </div>

  );
};
