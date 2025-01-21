/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodosList/TodosList';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosType, setTodosType] = useState<FilterType>(FilterType.ALL);
  const [isError, setIsError] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetError = (message: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsError(message);

    timerRef.current = setTimeout(() => {
      setIsError('');
      timerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleSetError('Unable to load todos');
        new Error('Unable to load todos');
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (todosType === FilterType.ACTIVE) {
      return !todo.completed;
    }

    if (todosType === FilterType.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const handleTodosTypeChange = (type: FilterType) => {
    setTodosType(type);
  };

  const handleAddTodo = (title: string) => {
    if (title.length === 0) {
      handleSetError('Title should not be empty');

      return Promise.reject(new Error('Title is empty'));
    }

    setTempTodo({ id: 0, title: title, completed: false } as Todo);

    return postService
      .addTodo(title, false)
      .then(newTodo => {
        setTodos(currentList => [...currentList, newTodo]);
      })
      .catch(() => {
        handleSetError('Unable to add a todo');
        throw new Error('Unable to add a todo');
      })
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);

    return postService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentList =>
          currentList?.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setIsError('Unable to delete a todo');
        handleSetError('Unable to delete a todo');
        // new Error(error.message);
      })
      .finally(() => {
        setLoadingTodos(prev => prev.filter(id => id !== todoId));
      });
  };

  // const handleUpdateTodo = (updatedTodo: Todo) => {
  //   setCurrentTodo(updatedTodo.id);
  //   setIsLoading(true);

  //   return postService
  //     .updateTodo(updatedTodo)
  //     .then(() => {
  //       setTodoList(currentList => {
  //         return currentList?.map(todo =>
  //           todo.id === updatedTodo.id ? updatedTodo : todo,
  //         );
  //       });
  //       setIsError('');
  //     })
  //     .catch(error => {
  //       setIsError('Unable to update a todo');
  //       throw error;
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //       setCurrentTodo(0);
  //     });
  // };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header handleAddTodo={handleAddTodo} todos={todos} />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          handleDeleteTodo={handleDeleteTodo}
        />

        <Footer
          todos={todos}
          todosType={todosType}
          handleTodosTypeChange={handleTodosTypeChange}
          handleDeleteTodo={handleDeleteTodo}
        />
      </div>

      <Errors error={isError} />
    </div>
  );
};
