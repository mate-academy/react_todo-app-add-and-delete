import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Header } from './commponents/Header';
import { Footer } from './commponents/Footer';
import { Errors } from './commponents/Errors';
import { TodoCard } from './commponents/TodoCard';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Status>(Status.All);
  const [errorType, setErrorType] = useState<string>('');
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [deleteItemTodo, setDeleteItemTodo] = useState(NaN);
  const [loadedDelete, setLoadedDelete] = useState(false);
  const [todoTask, setTodoTask] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const timeoutId = setTimeout(() => setErrorType(''), 3000);

      try {
        const todosData = await getTodos();

        setTodos(todosData);
      } catch {
        setErrorType(ErrorType.UnableToLoad);
        clearTimeout(timeoutId);
      }

      return () => clearTimeout(timeoutId);
    };

    fetchTodos();
  }, []);

  const countTodo = todos.filter(todo => !todo.completed).length;

  const todoFilter = todos.filter(todo => {
    if (filterType === Status.Active) {
      return !todo.completed;
    }

    if (filterType === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const addNewTodo = useCallback(async (todoToAdd: Todo) => {
    setNewTodo(todoToAdd);

    try {
      const todoNew = await addTodo(todoToAdd);

      setTodos(currentTodos => [...currentTodos, todoNew]);
      setTodoTask('');
    } catch {
      setErrorType(ErrorType.UnableToAdd);
    } finally {
      setNewTodo(null);
    }
  }, []);

  const deleteTodoItem = useCallback(async (todoId: number) => {
    setDeleteItemTodo(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorType(ErrorType.UnableToDelete);
    } finally {
      setDeleteItemTodo(NaN);
    }
  }, []);

  const loadedDeleteTodo = () => {
    setLoadedDelete(true);
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.forEach(val => {
          if (val.status === 'rejected') {
            setErrorType(ErrorType.UnableToDelete);
          } else {
            setTodos(currentTodos => {
              const todoId = val.value as Todo;

              return currentTodos.filter(todo => todo.id !== todoId.id);
            });
          }
        });
      })
      .finally(() => setLoadedDelete(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorType={setErrorType}
          todoTask={todoTask}
          onChangeTodoTask={setTodoTask}
          newTodo={newTodo}
          deleteItemTodo={deleteItemTodo}
          loadedDelete={loadedDelete}
          addNewTodo={addNewTodo}
          lengthOfTodo={todos.length}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {todoFilter.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              deleteItemTodo={deleteItemTodo}
              loadedDelete={loadedDelete}
              hasNewTodo={false}
              deleteTodoItem={deleteTodoItem}
            />
          ))}

          {newTodo && (
            <TodoCard
              todo={newTodo}
              hasNewTodo={true}
              deleteTodoItem={deleteTodoItem}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            onFiltered={setFilterType}
            countTodo={countTodo}
            todos={todos}
            loadedDelete={loadedDelete}
            loadedDeleteTodo={loadedDeleteTodo}
          />
        )}
      </div>

      <Errors errorType={errorType} clearError={() => setErrorType('')} />
    </div>
  );
};
