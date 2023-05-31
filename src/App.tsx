/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodos, deleteTodo } from './api/todos';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 10522;

enum ErorrType {
  NONE,
  ADDERORR,
  DELETEERORR,
  UPDATEERORR,
}

enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [erorr, setErorr] = useState<ErorrType>(ErorrType.NONE);
  const [filterTodos, setFilterTodos] = useState(Filter.ALL);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  let timeErorr:number;

  const funcVisibleTodos = (arrItems:Todo[], typeFilter:Filter) => {
    const items = [...arrItems];

    return items.filter(item => {
      switch (typeFilter) {
        case Filter.ALL:
          return item;

        case Filter.ACTIVE:
          return !item.completed;

        case Filter.COMPLETED:
          return item.completed;

        default:
          return item;
      }
    });
  };

  const visibleTodos = useMemo(() => funcVisibleTodos(todos, filterTodos),
    [todos, filterTodos]);

  const clearErorr = () => {
    setErorr(ErorrType.NONE);
    window.clearTimeout(timeErorr);
  };

  const funcVisibleErorr = () => {
    timeErorr = window.setTimeout(clearErorr, 3000);
  };

  const addNewTodos = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title) {
      const newItemTodo = {
        userId: 10522,
        title,
        completed: false,
      };

      setIsDisabled(true);
      addTodos('/todos', newItemTodo).then((newTodo) => {
        setTodos([...todos, newTodo]);
        setIsDisabled(false);
      });
    } else {
      setErorr(ErorrType.ADDERORR);
    }

    setTitle('');
  };

  const onDelete = (id:number) => {
    setTodos(todos.filter(todoItem => todoItem.id !== id));
    deleteTodo(id);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(allTodos => setTodos(allTodos))
      .catch(() => setErorr(ErorrType.UPDATEERORR));
  }, []);

  useEffect(() => {
    funcVisibleErorr();
  }, [erorr]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={addNewTodos}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  onDelete={onDelete}
                  // onUpdate={setTodo}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </section>

        {todos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>
            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterTodos === Filter.ALL },
                )}
                onClick={() => setFilterTodos(Filter.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterTodos === Filter.ACTIVE },
                )}
                onClick={() => setFilterTodos(Filter.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterTodos === Filter.COMPLETED },
                )}
                onClick={() => setFilterTodos(Filter.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button type="button" className="todoapp__clear-completed">
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: erorr === ErorrType.NONE },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => clearErorr()}
        />
        {erorr === ErorrType.ADDERORR && (
          <div>Unable to add a todo</div>
        )}
        {erorr === ErorrType.DELETEERORR && (
          <div>Unable to delete a todo</div>
        )}
        {erorr === ErorrType.UPDATEERORR && (
          <div>Unable to update a todo</div>
        )}
      </div>
    </div>
  );
};
