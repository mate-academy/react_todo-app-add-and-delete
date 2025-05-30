/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterValues, Filter } from './types/Filter';
import { Header } from './components/Header';
import { ToDoList } from './components/ToDoList';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoById, setDeleteTodoById] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [lastOperationTimestamp, setLastOperationTimestamp] = useState(
    Date.now(),
  );

  useEffect(() => {
    let newTodos = [...todos];

    switch (filter) {
      case FilterValues.ALL:
        break;
      case FilterValues.ACTIVE:
        newTodos = todos.filter(todo => !todo.completed);
        break;
      case FilterValues.COMPLETED:
        newTodos = todos.filter(todo => todo.completed);
        break;
    }

    setFilteredTodos(newTodos);
  }, [filter, todos]);

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorType.LOAD_TODOS_FAILED);

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  }, []);

  const handleToggleTodo = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      return todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : todo;
    });

    setTodos(updatedTodos);
  };

  const handleAddTodo = async (title: string) => {
    setIsAddingTodo(true);

    const todoToSend = {
      userId: USER_ID,
      title: title,
      completed: false,
    };

    const temporaryTodo = {
      ...todoToSend,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTempTodo(temporaryTodo);

    try {
      const newTodoFromApi = await postTodo(todoToSend);

      setTodos(prevTodos => [...prevTodos, newTodoFromApi]);
    } catch (error) {
      setErrorMessage(ErrorType.ADD_TODO_FAILED);
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      setLastOperationTimestamp(Date.now());
    }
  };

  const handleDeleteTodo = (id: number) => {
    setDeleteTodoById(prevId => [...prevId, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DELETE_TODO_FAILED);
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => {
        setDeleteTodoById(prevIds =>
          prevIds.filter(currentId => currentId !== id),
        );
        setLastOperationTimestamp(Date.now());
      });
  };

  const handleClearCompleted = () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    if (todosToDelete.length === 0) {
      return;
    }

    const idsToProcess = todosToDelete.map(todo => todo.id);

    setDeleteTodoById(prevIds => [...prevIds, ...idsToProcess]);

    const tabOfPromises = todosToDelete.map(todo => deleteTodo(todo.id));

    Promise.allSettled(tabOfPromises)
      .then(results => {
        const successfullyDeletedIds = new Set<number>();
        let hasError = false;

        results.forEach((result, index) => {
          const originalTodoId = todosToDelete[index].id;

          if (result.status === 'fulfilled') {
            successfullyDeletedIds.add(originalTodoId);
          } else {
            hasError = true;
          }
        });

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.has(todo.id)),
        );

        if (hasError) {
          setErrorMessage(ErrorType.DELETE_TODO_FAILED);
          setTimeout(() => setErrorMessage(null), 3000);
        }
      })
      .finally(() => {
        setDeleteTodoById(prevIds =>
          prevIds.filter(id => !idsToProcess.includes(id)),
        );
        setLastOperationTimestamp(Date.now());
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
          isAddingTodo={isAddingTodo}
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          focusTrigger={lastOperationTimestamp}
        />

        {todos.length > 0 && (
          <ToDoList
            filteredTodos={filteredTodos}
            deleteTodoById={deleteTodoById}
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
