/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, FormEvent } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo as TypeTodo } from './types/Todo';
import { Todo } from './components/Todo';
import { Filter } from './components/Filter';
import { Notification } from './components/Notification';

const USER_ID = 10607;

enum FilterType {
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<TypeTodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TypeTodo[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<TypeTodo | null>(null);
  const [addedTodoTitle, setAddedTodoTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  // useEffect(() => {
  //   getTodos(USER_ID)
  //     .then(response => {
  //       setTodosList(response);
  //       setFilteredTodos(response);
  //     })
  //     .catch(() => setError('Unable to load todos'));
  // }, [todosList, tempTodo, deletedTodoIds]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodosList(response);
      })
      .catch(() => setError('Unable to Load todos'));
  }, [deletedTodoIds]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setFilteredTodos(response);
      })
      .catch(() => setError('Unable to Load todos'));
  }, [todosList, tempTodo]);

  useEffect(() => {
    switch (filter) {
      case FilterType.Active: {
        setFilteredTodos(todosList.filter(todo => !todo.completed));
        break;
      }

      case FilterType.Completed: {
        setFilteredTodos(todosList.filter(todo => todo.completed));
        break;
      }

      default: {
        setFilteredTodos(todosList);
      }
    }
  }, [filter]);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  const handleFilterChange = (filteredBy: string) => {
    setFilter(filteredBy);
  };

  const todosLeftCounter = todosList.filter(todo => (
    !todo.completed
  )).length;

  const handleErrorReset = () => {
    setError('');
  };

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (addedTodoTitle) {
      const addedTodo: TypeTodo = {
        id: 0,
        userId: USER_ID,
        title: addedTodoTitle,
        completed: false,
      };

      setTempTodo(addedTodo);
      setInputDisabled(true);

      addTodo(USER_ID, addedTodo).then(() => {
        setAddedTodoTitle('');
        setTempTodo(null);
        setInputDisabled(false);
      }).catch(() => setError('Unable to add a todo'));
    } else {
      // eslint-disable-next-line @typescript-eslint/quotes
      setError(`Title can't be empty`);
    }
  };

  const handleRemoveTodo = (id: number) => {
    removeTodo(id).then(() => {
      setTodosList(todosList.filter((todo) => todo.id !== id));
    }).catch(() => setError('Unable to delete a todo'));
  };

  const completedTodos = todosList.filter(todo => (todo.completed));

  const handleRemoveCompleted = () => {
    completedTodos.forEach(completedTodo => {
      removeTodo(completedTodo.id).then(() => {
        setTodosList(todosList.filter((todo) => todo.id !== completedTodo.id));
        setDeletedTodoIds(deleted => [
          ...deleted,
          completedTodo.id,
        ]);
      }).catch(() => setError('Unable to delete a todo'));
    });
  };

  const todos = filteredTodos.map(todo => (
    <Todo
      todo={todo}
      key={todo.id}
      handleRemoveTodo={handleRemoveTodo}
    />
  ));

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all',
              {
                active: todosList.filter(todo => !todo.completed).length === 0,
              })}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addedTodoTitle}
              onChange={(event) => setAddedTodoTitle(event.target.value)}
              disabled={inputDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {todos}
          {tempTodo && <Todo todo={tempTodo} />}
        </section>

        {todosList.length > 0
          && (
            <Filter
              todosLeftCounter={todosLeftCounter}
              handleFilterChange={handleFilterChange}
              filter={filter}
              handleRemoveCompleted={handleRemoveCompleted}
              completedTodos={completedTodos}
            />
          )}
      </div>

      <Notification message={error} handleErrorReset={handleErrorReset} />
    </div>
  );
};
