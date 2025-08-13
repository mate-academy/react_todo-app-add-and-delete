/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
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
  const [addTodo, setAddTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const activeTodosQuantity = todos.filter(todo => !todo.completed).length;
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

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
    try {
      const newTodoFromApi = await postTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTempTodo(null);
      setTodos(prevTodos => [...prevTodos, newTodoFromApi]);
      setNewTodoTitle('');
    } catch {
      setErrorMessage(ErrorTypes.ADD_TODO_FAILED);
      setNewTodoTitle(title);
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 900);
      setAddTodo(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setLoadingTodos(current => [...current, id]);
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorTypes.DELETE_TODO_FAILED);
      setTimeout(clearErrorMessage, 3000);
      inputRef.current?.focus();
    } finally {
      setLoadingTodos(current => current.filter(todoId => todoId !== id));

      inputRef.current?.focus();
    }
  };

  const clearCompletedTodos = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(id => handleDeleteTodo(id));
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
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputRef={inputRef}
        />
        {todos.length > 0 && (
          <TodoList
            filteredTodos={getFilteredTodos()}
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
