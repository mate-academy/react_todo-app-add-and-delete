/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { TodosContext } from '../context/TodosContext';
import { TodoList } from './TodoList';
import { TodosFilter } from './TodosFilter';
import { addTodo, deleteTodo } from '../api/todos';
import { USER_ID } from '../variables';
import { Todo } from '../types/Todo';

export const TodoApp: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [toHideError, setToHideError] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);

  /*
    Unable to update a todo
  */

  const [todosPrep, setTodos, errorMsg, setErrorMsg] = useContext(TodosContext);

  const todos = todosPrep.filter((todo) => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const leftTodos = todosPrep.filter((todo) => !todo.completed);
  const completedTodos = todosPrep.filter((todo) => todo.completed);
  const leftTodosText = leftTodos.length === 1 ? 'item' : 'items';

  const [allCompleated, setAllCompleated] = useState(
    leftTodos.length === 0,
  );

  const hideError = () => {
    setToHideError(true);

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  useEffect(() => {
    setAllCompleated(leftTodos.length === 0);
  }, [leftTodos.length]);

  useEffect(() => {
    if (errorMsg === '') {
      return;
    }

    setToHideError(false);

    setTimeout(() => {
      hideError();
    }, 3000);
  }, [errorMsg]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length]);

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMsg('Title can\'t be empty');

      return;
    }

    if (errorMsg !== '') {
      hideError();
    }

    setTempTodo({
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
      id: 0,
    });

    addTodo({
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    })
      .then((newTodo) => {
        setTodos([...todosPrep, newTodo]);
      })
      .catch(() => {
        setErrorMsg('Unable to add a todo');
      })
      .finally(() => setTempTodo(null));

    setTodoTitle('');
  };

  const handleClearCompleted = async () => {
    const idsToDelete: number[] = [];

    setProcessedTodoIds(completedTodos.map(({ id }) => id));

    if (errorMsg !== '') {
      hideError();
    }

    await Promise.all(completedTodos.map(({ id }) => {
      return deleteTodo(id)
        .then(() => {
          idsToDelete.push(id);
        })
        .catch(() => {
          setErrorMsg('Unable to delete a todo');
        });
    }));

    setTodos(todosPrep.filter((todo) => !idsToDelete.includes(todo.id)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosPrep.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleated,
              })}
            />
          )}

          <form
            onSubmit={handleTodoAdd}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={!!tempTodo}
              ref={inputRef}
            />
          </form>
        </header>

        {todosPrep.length > 0 && (
          <>

            <TodoList
              todos={todos}
              hideError={hideError}
              proccessedTodoIds={processedTodoIds}
              tempTodo={tempTodo}
            />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${leftTodos.length} ${leftTodosText} left`}
              </span>

              <TodosFilter
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />

              {completedTodos.length > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: toHideError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMsg}
      </div>
    </div>
  );
};
