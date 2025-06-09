/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [addTodo, setAddTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const activeTodosQuantity = todos.filter(todo => !todo.completed).length;
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.LOAD_TODOS_FAILED);

        setTimeout(clearErrorMessage, 3000);
      });
  }, []);

  useEffect(() => {
    let newTodos = [...todos];

    switch (filter) {
      case Filter.All:
        break;
      case Filter.Active:
        newTodos = todos.filter(todo => !todo.completed);
        break;
      case Filter.Completed:
        newTodos = todos.filter(todo => todo.completed);
        break;
    }

    setFilteredTodos(newTodos);
  }, [todos, filter]);

  const handleTodoChange = (id: number, completed: boolean) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo,
      ),
    );
  };

  const handleAddTodo = async (title: string) => {
    setAddTodo(true);

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setTodos(prevTodos => [...prevTodos, temporaryTodo]);

    try {
      const newTodoFromApi = await postTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo === temporaryTodo ? newTodoFromApi : todo)),
      );
    } catch {
      setTodos(prevTodos => prevTodos.filter(todo => todo !== temporaryTodo));
      setErrorMessage(ErrorTypes.ADD_TODO_FAILED);
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setAddTodo(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setLoadingTodos(current => [...current, id]); // Додаємо завдання до оброблюваних
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorTypes.DELETE_TODO_FAILED);
      setTimeout(clearErrorMessage, 3000);
    } finally {
      setLoadingTodos(current => current.filter(todoId => todoId !== id)); // Видаляємо завдання з оброблюваних
    }
  };

  const clearCompletedTodos = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
    try {
      setLoadingTodos(current => [...current, ...completedIds]); // Додаємо всі завершені завдання до loading

      await Promise.all(completedIds.map(id => deleteTodo(id))); // Видаляємо з сервера

      setTodos(todos.filter(todo => !todo.completed)); // Видаляємо з локального стану
    } catch {
      setErrorMessage(ErrorTypes.CLEAR_COMPLETED_FAILED);
      setTimeout(clearErrorMessage, 3000);
    } finally {
      setLoadingTodos(current =>
        current.filter(id => !completedIds.includes(id)), // Видаляємо тільки оброблені
      );
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          activeTodosQuantity={activeTodosQuantity}
          handleAddTodo={handleAddTodo}
          handleTodoChange={handleTodoChange}
        />
        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            onChange={handleTodoChange}
            handleDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            loadingTodos={loadingTodos}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosQuantity={activeTodosQuantity}
            filter={filter}
            setFilter={setFilter}
            totalTodos={todos.length}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};
