/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import { DeletionResult, DeletionSucces } from './types/Deletion';
import { ErrorText } from './types/enums/ErrorText';
import { Filter } from './types/enums/Filter';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorText>(ErrorText.Init);
  const [activeLink, setActiveLink] = useState<Filter>(Filter.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(
      () => setErrorMessage(ErrorText.Init),
      3000,
    );

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorText.UnableLoad));
  }, []);

  const filteredTodos = todos.filter(t => {
    if (activeLink === Filter.All) {
      return true;
    }

    if (activeLink === Filter.Active) {
      return !t.completed;
    }

    if (activeLink === Filter.Completed) {
      return t.completed;
    }

    return false;
  });

  function addTodo(trimmedTitle: string) {
    setErrorMessage(ErrorText.Init);
    if (!trimmedTitle) {
      return setErrorMessage(ErrorText.EmptyTitle);
    }

    const tempId = 0;
    const newTempTodo = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingTodoIds(prevIds => [...prevIds, newTempTodo.id]);

    return todoServise
      .createTodo(newTempTodo)
      .then(todoFromServer => {
        setTodos(prevTodos => [...prevTodos, todoFromServer]);
        setTempTodo(null);
      })
      .catch(error => {
        setErrorMessage(ErrorText.UnableAdd);
        setTempTodo(null);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }

  function deleteTodo(todoId: number) {
    setErrorMessage(ErrorText.Init);
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return todoServise
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todoId)),
      )
      .catch(error => {
        setErrorMessage(ErrorText.UnableDelete);
        throw error;
      })
      .finally(() => setLoadingTodoIds([]));
  }

  function updateTodo(updatedTodo: Todo) {
    setErrorMessage(ErrorText.Init);
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);

    return todoServise
      .updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos((prevTodos: Todo[]) => {
          return prevTodos.map(prevTodo =>
            prevTodo.id === todoFromServer.id ? todoFromServer : prevTodo,
          );
        });
      })
      .catch(error => {
        setErrorMessage(ErrorText.UnableUpdate);
        throw error;
      })
      .finally(() => setLoadingTodoIds([]));
  }

  // function handleClearCompleted() {
  //   for (const todo of todos) {
  //     if (!todo.completed) {
  //       continue;
  //     }

  //     setLoadingTodoIds(prevIds => [...prevIds, todo.id]);

  //     todoServise
  //       .deleteTodo(todo.id)
  //       .then(() =>
  //         setTodos(currrentTodos =>
  //           currrentTodos.filter(currentTodo => !currentTodo.completed),
  //         ),
  //       )
  //       .catch(error => {
  //         setTodos(todos);
  //         setErrorMessage(ErrorText.UnableDelete);
  //         throw error;
  //       })
  //       .finally(() => setLoadingTodoIds([]));
  //   }
  // }

  function handleClearCompleted() {
    setErrorMessage(ErrorText.Init);

    const completedTodos = todos.filter(t => t.completed);

    setLoadingTodoIds(completedTodos.map(t => t.id));

    const deletionPromises: Promise<DeletionResult>[] = completedTodos.map(
      todo =>
        todoServise
          .deleteTodo(todo.id)
          .then((): DeletionSucces => {})
          .catch(() => {
            return { error: true, todo };
          }),
    );

    Promise.all<DeletionResult>(deletionPromises)
      .then(results => {
        const failedDeletions = results.filter(
          result => result && result.error,
        );

        if (failedDeletions.length > 0) {
          setErrorMessage(ErrorText.UnableDelete);
          const failedIds = failedDeletions.map(res => res?.todo.id);

          setTodos(prevTodos =>
            prevTodos.filter(
              todo => !todo.completed || failedIds.includes(todo.id),
            ),
          );
        } else {
          setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
        }
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }

  function handleToggleCheckboxes() {
    const isActiveTodo = filteredTodos.some(t => !t.completed);
    const toggledTodos = filteredTodos.map(t =>
      isActiveTodo ? { ...t, completed: true } : { ...t, completed: false },
    );

    for (const todo of toggledTodos) {
      setLoadingTodoIds(prevIds => [...prevIds, todo.id]);
      todoServise
        .updateTodo(todo)
        .then(() => {
          setTodos(toggledTodos);
        })
        .catch(error => {
          setTodos(todos);
          setErrorMessage(ErrorText.UnableUpdate);
          throw error;
        })
        .finally(() => setLoadingTodoIds([]));
    }
  }

  return (
    <div className={classNames('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          onAddTodo={titleTrimmed => addTodo(titleTrimmed)}
          onChangeCheckboxes={handleToggleCheckboxes}
        />

        <TodoList
          todos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={todoId => deleteTodo(todoId)}
        />

        {todos.length > 0 && (
          <Footer
            todos={filteredTodos}
            activeTodoCount={
              todos.filter((todo: Todo) => !todo.completed).length
            }
            activeLink={activeLink}
            onChangeActiveLink={setActiveLink}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorNotification
        errorMessage={errorMessage}
        onChangeErrorMessage={setErrorMessage}
      />
    </div>
  );
};
