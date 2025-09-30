/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType } from './types/filterType';
import { ErrorMessages } from './types/errorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | string>(
    ErrorMessages.none,
  );
  const [filterType, setFilterType] = useState<FilterType>(FilterType.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodosId, setDeletedTodosId] = useState<number[]>([]);

  const errorTimer = useRef<number | null>(null);
  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const handleErrorMessage = (message: ErrorMessages) => {
    setErrorMessage(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    if (message !== ErrorMessages.none) {
      errorTimer.current = window.setTimeout(() => {
        setErrorMessage(ErrorMessages.none);
        errorTimer.current = null;
      }, 3000);
    }
  };

  const getAllTodos = async () => {
    try {
      const allTodos = await getTodos();

      setTodos(allTodos);
    } catch {
      handleErrorMessage(ErrorMessages.todosLoadError);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const TodosFilter = (filterBy: FilterType): Todo[] => {
    switch (filterBy) {
      case FilterType.all:
        return todos;
      case FilterType.active:
        return todos.filter(todo => !todo.completed);
      case FilterType.completed:
        return todos.filter(todo => todo.completed);
    }
  };

  function handleAddTodo(title: string) {
    const newTodo: Todo = {
      title: title,
      completed: false,
      userId: USER_ID,
      id: 0,
    };

    setTempTodo(newTodo);
    
    setErrorMessage(ErrorMessages.none);

    return addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
      })
      .catch(() => {
        handleErrorMessage(ErrorMessages.todoAddError);

        return Promise.reject();
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  function handleDeleteTodo(id: number) {
    setErrorMessage(ErrorMessages.none);
    setDeletedTodosId(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrorMessage(ErrorMessages.todoDeleteError);

        return Promise.reject();
      })
      .finally(() =>
        setDeletedTodosId(prev => prev.filter(prevID => prevID !== id)),
      );
  }

  function handleDeleteCompletedTodos() {
    Promise.allSettled(
      completedTodos.map(todo => handleDeleteTodo(todo.id)),
    ).then(results => {
      if (results.some(res => res.status === 'rejected')) {
        handleErrorMessage(ErrorMessages.todosDeleteError);
      }
    });
  }

  const filteredTodos = TodosFilter(filterType);
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onErrorMessage={handleErrorMessage}
          onAddTodo={handleAddTodo}
          deletedTodosId={deletedTodosId}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            onDeletedTodo={handleDeleteTodo}
            deletedTodosId={deletedTodosId}
            completedTodos={completedTodos}
          />
        </section>

        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filterType={filterType}
            onFilterClick={setFilterType}
            completedTodos={completedTodos}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideErrorButtonClick={setErrorMessage}
      />
    </div>
  );
};
