/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTodos } from './components/FilterTodos/FilterTodos';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { Form } from './components/Form/Form';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

const USER_ID = 11547;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter]
  = useState<Filter>(Filter.All);
  const [isError, setIsError] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setError('Unable to load todos');
        setTimeout(() => setIsError(false), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectedFilter = (filter: Filter) => {
    setActiveFilter(filter);
  };

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === Filter.Active) {
      return !todo.completed;
    }

    if (activeFilter === Filter.Completed) {
      return todo.completed;
    }

    return todo;
  });

  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const countCompletedTodos = todos.filter(todo => todo.completed).length;

  const toggleCompleted = (id: number) => {
    const selectedTodo = todos.find(todo => todo.id === id);
    let updatedTodos;

    if (selectedTodo) {
      updatedTodos = todos.map(todo => (
        todo === selectedTodo
          ? { ...todo, completed: !todo.completed }
          : todo
      ));

      setTodos(updatedTodos);
    }
  };

  const onTitleChange = (query: string) => {
    setIsError(false);
    setTitle(query.trimStart());
  };

  const onSubmit = () => {
    if (title === '') {
      setIsError(true);
      setError('Title should not be empty');
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }

    if (title !== '') {
      const temporaryTodo = {
        id: 0,
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(temporaryTodo);

      addTodo({
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      })
        .then(response => {
          setTitle('');
          setTodos([...todos, response]);
          setTempTodo(null);
        })
        .catch(() => {
          setTempTodo(null);
          setIsError(true);
          setError('Unable to add a todo');
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        });
    }
  };

  const handleRemove = (id: number) => {
    const filteredValues = todos.filter(todo => todo.id !== id);
    const deletedValue = todos.find(todo => todo.id === id) as Todo;

    setDeletedTodoId(deletedValue.id);

    deleteTodo(id)
      .then(() => setTodos(filteredValues))
      .catch(() => {
        setIsError(true);
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletedTodoId(null);
        setTitle('');
      });
  };

  const handleClearCompleted = () => {
    const filterCompleted = todos.filter(todo => todo.completed);
    const removedTodos: number[] = [];

    for (let i = 0; i < filterCompleted.length; i += 1) {
      setDeletedTodoId(filterCompleted[i].id);

      deleteTodo(filterCompleted[i].id)
        .then(() => {
          removedTodos.push(filterCompleted[i].id);
        })
        .catch(() => {
          setIsError(true);
          setError('Unable to delete a todo');
        })
        .finally(() => {
          setDeletedTodoId(null);
          setTodos(todos.filter(todo => !removedTodos.includes(todo.id)));
        });
    }
  };

  const hideError = () => {
    setIsError(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.filter(todo => !todo.completed).length !== 0
          && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <Form
            handleTitleChange={onTitleChange}
            onSubmit={onSubmit}
            title={title}
            tempTodo={tempTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          toggleCompleted={toggleCompleted}
          tempTodo={tempTodo}
          handleRemove={handleRemove}
          deletedTodoId={deletedTodoId}
        />

        {!isLoading && todos.length > 0
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${countActiveTodos} items left`}
            </span>

            <FilterTodos
              activeFilter={activeFilter}
              handleSelectedFilter={handleSelectedFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={countCompletedTodos === 0}
            >
              Clear completed
            </button>
          </footer>
        ) }
      </div>

      <ErrorNotification
        error={error}
        isError={isError}
        hideError={hideError}
      />

    </div>
  );
};
