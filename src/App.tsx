/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
// import cn from 'classnames';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/components/Auth/AuthContext';
import { ErrorMessage } from './components/components/ErrorMessage';
import { TodoList } from './components/components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { Todo } from './types/Todo';
import { Footer } from './components/components/Footer';
import { getFilteredTodos } from './helpers/helpers';

export const App: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState(FilterTypes.ALL);
  const [newTodoToAdd, setNewTodoToAdd] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);

  const handleFilterOptionClick = (newOption: FilterTypes) => {
    if (selectedFilterType !== newOption) {
      setSelectedFilterType(newOption);
    }
  };

  const showErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      showErrorMessage('');
    }, 3000);
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          showErrorMessage('Unable to load a todos');
        });
    }
  }, [showErrorMessage, user]);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, selectedFilterType);
  }, [todos, selectedFilterType]);

  const filterOptions = Object.values(FilterTypes);

  const activeItemsCounter = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoToAdd) {
      setErrorMessage("Title can't be empty");

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title: newTodoToAdd,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      addTodo(newTodo)
        .then(uploadedTodo => setTodos(prev => ([
          ...prev,
          uploadedTodo,
        ])))
        .catch(() => showErrorMessage('Unable to add a todo`'))
        .finally(() => {
          setNewTodoToAdd('');
          setTempTodo(null);
          setErrorMessage('');
        });
    }
  };

  const handleDeleteTodo = useCallback((id: number) => {
    setDeletingTodosIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => (
          todo.id !== id
        )));
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodosIds(prev => {
          return prev.filter(deletingId => deletingId !== id);
        });
      });
  }, [showErrorMessage]);

  const handleClearCompletedClick = () => {
    const completedTodosIds = todos.reduce((ids: number[], todo) => {
      return todo.completed
        ? [...ids, todo.id]
        : ids;
    }, []);

    setDeletingTodosIds(prev => [...prev, ...completedTodosIds]);

    const deletePromises: Promise<unknown>[] = completedTodosIds.map(id => {
      return deleteTodo(id);
    });

    Promise.all(deletePromises).then(() => {
      setTodos(prev => prev.filter(({ id }) => {
        return !completedTodosIds.includes(id);
      }));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoToAdd}
              onChange={(event) => setNewTodoToAdd(event.target.value)}
            />
          </form>
        </header>

        {(todos.length > 0 || !!tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={handleDeleteTodo}
              deletingTodosIds={deletingTodosIds}
              tempTodo={tempTodo}
            />

            <Footer
              setFilterType={handleFilterOptionClick}
              itemsCounter={activeItemsCounter}
              filterOptions={filterOptions}
              filterType={selectedFilterType}
              handleClearCompletedClick={handleClearCompletedClick}
              visibleTodos={visibleTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onCloseBtnClick={() => setErrorMessage('')}
      />
    </div>
  );
});
