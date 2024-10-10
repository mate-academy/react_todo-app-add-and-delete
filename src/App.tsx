/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { Todo } from './types/Todo';
import { FilterCriteria } from './types/FilterCriteria';
import * as todoServise from './api/todos';
import { Header, Footer, TodoList, ErrorNotification } from './components';

const filterTodos = (tasks: Todo[], filterCriteria: FilterCriteria) => {
  return tasks.filter(task => {
    const matchesStatus =
      filterCriteria === FilterCriteria.All ||
      (filterCriteria === FilterCriteria.Active && !task.completed) ||
      (filterCriteria === FilterCriteria.Completed && task.completed);

    return matchesStatus;
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterCriteria>(FilterCriteria.All);
  const [titleTodo, setTitleTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);

    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const getFilteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter]);

  function addTodo({ title, userId, completed }: Todo) {
    setLoading(true);

    const newTempTodo = {
      id: 0,
      userId: todoServise.USER_ID,
      title,
      completed: false,
    };
    setTempTodo(newTempTodo);

    todoServise
      .createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add todo');
      })
      .finally(() => {
        setLoading(false);
        setTitleTodo('');
        setTempTodo(null);
      });
  }

  function updateTodo(updatedTodo: Todo) {
    setLoadingTodoIds(ids => [...ids, updatedTodo.id]);

    todoServise
      .updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodo = [...currentTodos];
          const index = newTodo.findIndex(post => post.id === updatedTodo.id);
          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(ids => ids.filter(id => id !== updatedTodo.id)); // Remove todo id from loading state
        setTitleTodo('');
      });
  }

  function deleteTodo(todoId: number) {
    setLoadingTodoIds(ids => [...ids, todoId]); // Add id to the array

    todoServise
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete todo');
      })
      .finally(() => {
        setLoadingTodoIds(ids => ids.filter(id => id !== todoId)); // Delete id after completion
      });
  }

  const handleFilter = (filterType: FilterCriteria) => {
    setFilter(filterType);
  };

  const activeTodos = todos.filter(todo => !todo.completed).length || 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          loading={loading}
          titleTodo={titleTodo}
          setTitleTodo={setTitleTodo}
        />

        <TodoList
          todos={getFilteredTodos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
        />

        {!!todos.length && !loading && (
          <Footer
            handleFilter={handleFilter}
            filter={filter}
            todos={getFilteredTodos}
            deleteTodo={deleteTodo}
            activeTodos={activeTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
