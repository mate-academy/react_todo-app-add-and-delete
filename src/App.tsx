/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Options } from './types/Options';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [selectedOption, setSelectedOption] = useState<Options>(Options.All);
  const [focus, setFocus] = useState(false);

  const filterTodos = (posts: Todo[], option: Options) => {
    switch (option) {
      case Options.Active:
        return posts.filter(post => !post.completed);

      case Options.Completed:
        return posts.filter(post => post.completed);

      default:
        return posts;
    }
  };

  const todoFilterSelectedOptions = filterTodos(todos, selectedOption);
  const todoFilterOptionActive = filterTodos(todos, Options.Active);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const showError = useCallback(
    (error: Errors) => {
      setErrorMessage(error);

      setTimeout(() => {
        clearError();
      }, 3000);
    },
    [clearError],
  );

  useEffect(() => {
    setFocus(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(Errors.LoadTodos));
  }, [showError]);

  const addTodo = useCallback(
    async ({ userId, title, completed }: Omit<Todo, 'id'>) => {
      const newTempTodo: Todo = {
        id: 0,
        userId,
        title,
        completed,
      };

      setTempTodo(newTempTodo);

      try {
        const newTodo = await todoService.createTodos({
          userId,
          title,
          completed,
        });

        setTodos(currentTodo => [...currentTodo, newTodo]);
      } catch {
        showError(Errors.AddTodo);
        throw new Error();
      } finally {
        setTempTodo(null);
        setFocus(true);
      }
    },
    [showError],
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      try {
        await todoService.deleteTodos(todoId);
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
        setFocus(true);
      } catch {
        showError(Errors.DeleteTodo);
        throw new Error();
      }
    },
    [showError],
  );

  const onToogleAll = (completed: boolean) => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed,
    }));

    setTodos(updatedTodos);
  };

  const clearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          showError(Errors.DeleteTodo);
        }),
    );
  }, [todos, showError, deleteTodo]);

  const toggleCompleted = useCallback((todoId: number) => {
    setTodos(currentTodo =>
      currentTodo.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  // function updateTodo(updatedTodo: Todo) {
  //   setErrorMessage();

  //   return todoService.updateTodos(updatedTodo)
  //     .then(todo => {
  //       setTodos(currentTodo => {
  //         const newTodo = [...currentTodo];
  //         const index = newTodo.findIndex(todo => todo.id === updatedTodo.id);

  //         newTodo.splice(index, 1, todo);

  //         return newTodo;
  //     })
  //   })
  //   .catch((error) => {
  //     setErrorMessage();
  //     throw error
  //   });
  // }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          // filteredTodo={todoFilterSelectedOptions}
          todos={todos}
          showError={showError}
          onAddTodo={addTodo}
          onToogleAll={onToogleAll}
          focusInput={focus}
          setFocusInput={setFocus}
        />

        <TodoList
          filteredTodo={todoFilterSelectedOptions}
          onDeleteTodo={deleteTodo}
          tempTodo={tempTodo}
          onToggleComplete={toggleCompleted}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            selected={selectedOption}
            setSelected={setSelectedOption}
            onClearCompleted={clearCompleted}
            activeTodo={todoFilterOptionActive}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} clear={clearError} />
    </div>
  );
};
