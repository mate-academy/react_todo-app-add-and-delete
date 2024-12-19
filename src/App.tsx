/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.Default,
  );
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.All) {
      return true;
    }

    return filter === Filter.Completed ? todo.completed : !todo.completed;
  });

  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LoadTodo);
      });
  }, []);

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorType.DeleteTodo);
      inputNameRef.current?.focus();
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleAddTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });
    try {
      const newTodo = await createTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorType.AddTodo);
      inputNameRef.current?.focus();
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
          inputNameRef={inputNameRef}
          todosLength={todos.length}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              isLoading
            />
          )}
        </section>

        {todos.length !== 0 && (
          <Footer
            notCompletedTodos={notCompletedTodos}
            filter={filter}
            handleFilterChange={handleFilterChange}
            filteredTodos={filteredTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
