import React, { useState, useEffect, useMemo } from 'react';
import { Todo } from './../../types/Todo';

import { FILTERS } from './../../constants/Filters';
import { ERROR_MESSAGES } from '../../constants/ErrorMessages';

import { TodoList } from './../TodoList';
import { Notification } from './../Notification';
import { Footer } from './../Footer';
import { Header } from './../Header';
import * as todoApi from './../../api/todos';

import './UserTodos.scss';

type Props = {
  userId: number;
};

export const UserTodos: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS.all);
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [affectedTodoIds, setAffectedTodoIds] = useState<number[]>([]);

  const resetErrorMessage = () => {
    setErrorMessage('');
  };

  function loadTodos() {
    setLoading(true);
    todoApi
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(loadTodos, [userId]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(resetErrorMessage, 3000);
    }
  }, [errorMessage]);

  const handleFilter = (currentFilter: string) => {
    setSelectedFilter(currentFilter);
  };

  const handleErrorInput = () => {
    setErrorMessage(ERROR_MESSAGES.title);
  };

  function addTodo(title: string, completed = false) {
    setDisabledInput(true);
    resetErrorMessage();
    setTempTodo({ id: 0, userId, title, completed });

    return todoApi
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos((currentTodos: Todo[]) => {
          return [...currentTodos, newTodo];
        });
      })
      .catch(error => {
        setErrorMessage(ERROR_MESSAGES.add);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);

        setDisabledInput(false);
      });
  }

  function deleteTodo(todoId: number) {
    setDisabledInput(true);
    resetErrorMessage();

    return todoApi
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(ERROR_MESSAGES.delete);
        throw error;
      })
      .finally(() => {
        setDisabledInput(false);
      });
  }

  function updateTodo(id: number, title: string, completed: boolean) {
    resetErrorMessage();

    return todoApi
      .updateTodo({ id, title, completed })
      .then(newTodo => {
        setTodos((currentTodos: Todo[]) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(error => {
        setErrorMessage(ERROR_MESSAGES.update);

        throw error;
      });
  }

  const visibleTodos = useMemo(() => {
    switch (selectedFilter) {
      case FILTERS.active:
        return todos.filter(todo => !todo.completed);

      case FILTERS.completed:
        return todos.filter(todo => todo.completed);

      default:
        return [...todos];
    }
  }, [todos, selectedFilter]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const numberOfCompleted = completedTodos.length;
  const numberOfActive = activeTodos.length;
  const areTodosCompleted = todos.length > 0 && numberOfActive === 0;

  const clearCompleted = () => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setAffectedTodoIds(completedTodoIds);

    const promiseArray = completedTodos.map(completedTodo => {
      return deleteTodo(completedTodo.id);
    });

    return Promise.all(promiseArray)

      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setAffectedTodoIds([]);
      });
  };

  const toggleAll = () => {
    const toggledTodos = areTodosCompleted ? completedTodos : activeTodos;
    const toggledTodoIds = toggledTodos.map(todo => todo.id);

    setAffectedTodoIds(toggledTodoIds);

    const promiseArray = toggledTodos.map(todo => {
      return updateTodo(todo.id, todo.title, !todo.completed);
    });

    return Promise.all(promiseArray)

      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setAffectedTodoIds([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        areTodosCompleted={areTodosCompleted}
        onSubmit={addTodo}
        disabled={disabledInput}
        onErrorInput={handleErrorInput}
        onToggleAll={toggleAll}
      />
      <div className="todoapp__content">
        {!loading && todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            affectedTodos={affectedTodoIds}
            onUpdateTodo={updateTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            numberOfActive={numberOfActive}
            numberOfCompleted={numberOfCompleted}
            selectedFilter={selectedFilter}
            onFilter={handleFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        notification={errorMessage}
        onHideNotification={resetErrorMessage}
      />
    </div>
  );
};
