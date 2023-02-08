/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { filteredTodos, activeTodosCount } from './helpers/functionsTodos';
import { NotificationTodo } from './Components/NotificationTodo';
import { TodoFooter } from './Components/TodoFooter';
import { TodoHeader } from './Components/TodoHeader';
import { TodoList } from './Components/TodoList';
import { Loader } from './Components/Loader';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';

const USER_ID = 6211;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isSelected, setIsSelected] = useState(true);
  const [filter, setFilter] = useState(Filter.All);
  const [error, setError] = useState(false);
  const [errorNotification, setErrorNotification] = useState(Errors.Empty);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number[]>([]);

  const visibeTodos = filteredTodos(todos, filter);
  const activeTodos = activeTodosCount(todos).length;
  const completedTodos = visibeTodos.length - activeTodos;
  const completedTodoList = filteredTodos(todos, Filter.Completed);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch (err) {
        throw new Error();
      } finally {
        setIsSelected(false);
      }
    };

    loadTodos();
  }, []);

  const setNotification = (message: Errors) => {
    setErrorNotification(message);
    setError(true);
  };

  const clearNotification = useCallback(() => {
    setError(false);
  }, []);

  const clearInput = () => {
    setInputValue('');
  };

  const handleCreateTodo = useCallback((title: string) => {
    clearNotification();

    if (!title) {
      setNotification(Errors.Empty);
    }

    if (title.trim()) {
      const newTodo = {
        id: 0,
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);
      addTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => [...prevTodos, todo]);
        })
        .catch(() => {
          setNotification(Errors.ErrorOnAdd);
        })
        .finally(() => {
          clearInput();
          setTempTodo(null);
        });
    }
  }, []);

  const handleDeleteTodo = useCallback((todoDel: Todo) => {
    setDeletingId(prev => [...prev, todoDel.id]);

    deleteTodo(USER_ID, todoDel.id)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoDel.id)
        ));
      })
      .catch(() => {
        setNotification(Errors.ErrorOnDelete);
      })
      .finally(() => {
        setDeletingId(prev => prev.filter(id => id !== todoDel.id));
      });
    clearNotification();
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    clearNotification();

    completedTodoList.forEach(todo => handleDeleteTodo(todo));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setInputValue={setInputValue}
          inputValue={inputValue}
          createTodo={handleCreateTodo}
          tempTodo={tempTodo}
        />

        {isSelected && <Loader />}
        {visibeTodos.length > 0 && (
          <TodoList
            todos={visibeTodos}
            handleDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            deletingId={deletingId}
          />
        )}

        <TodoFooter
          setFilter={setFilter}
          filter={filter}
          activeTodos={activeTodos}
          completedTodos={completedTodos}
          handleDeleteCompleted={handleDeleteCompleted}
        />
      </div>

      <NotificationTodo
        setError={setError}
        error={error}
        errorNotification={errorNotification}
        clearNotification={clearNotification}
      />
    </div>
  );
};
