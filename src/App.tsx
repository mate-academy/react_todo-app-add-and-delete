/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, postTodo, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const isFirstRender = useRef(true);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>(todosFromServer);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todosFilter, setTodosFilter] = useState(FilterStatus.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [shouldDeleteCompleted, setShouldDeleteCompleted] = useState(false);
  const [todoBeingAdded, setTodoBeingAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const focusedTodoRef = useRef<HTMLInputElement>(null);
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const [shouldToggleAllCompleted, setShouldToggleAllCompleted] =
    useState(false);

  function filterTodos(filter: string) {
    switch (filter) {
      case FilterStatus.Active:
        return currentTodos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return currentTodos.filter(todo => todo.completed);
      default:
        return currentTodos;
    }
  }

  const filteredTodos = filterTodos(todosFilter);

  const showError = React.useCallback((errMessage: string) => {
    if (errMessage) {
      setErrorMessage(errMessage);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  const getCompletedTodos = React.useCallback(() => {
    return currentTodos.filter(todo => todo.completed);
  }, [currentTodos]);

  const deleteChosenTodo = React.useCallback(
    (currentTodoToDelete: Todo | null) => {
      if (currentTodoToDelete) {
        deleteTodo(currentTodoToDelete)
          .then(() => {
            setCurrentTodos(
              currentTodos.filter(
                currTodo => currTodo.id !== currentTodoToDelete.id,
              ),
            );
          })
          .catch(() => {
            showError('Unable to delete a todo');
          })
          .finally(() => {
            if (currentTodoToDelete === selectedTodo) {
              setSelectedTodo(undefined);
            }

            defaultInputRef.current?.focus();
          });
      }
    },
    [currentTodos, showError, selectedTodo],
  );

  const getAndShowTodos = React.useCallback(() => {
    getTodos()
      .then(todos => {
        setTodosFromServer(todos);
        setCurrentTodos(todos);
      })
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => defaultInputRef.current?.focus());
  }, [showError]);

  const postNewTodo = React.useCallback(
    (todoToPost: Todo | null) => {
      if (todoToPost) {
        setTodoBeingAdded(true);
        setTempTodo({
          id: 0,
          userId: 2400,
          title: todoToPost.title,
          completed: todoToPost.completed,
        });

        postTodo(todoToPost)
          .then(postedTodo => {
            setCurrentTodos([...currentTodos, postedTodo]);
            setClearInput(true);
          })
          .catch(() => {
            showError('Unable to add a todo');
          })
          .finally(() => {
            setTodoBeingAdded(false);
            setTempTodo(null);
            defaultInputRef.current?.focus();
          });
      }
    },
    [currentTodos, showError],
  );

  const deleteCompletedTodos = React.useCallback(async () => {
    if (!shouldDeleteCompleted) {
      return;
    }

    const completedTodos = getCompletedTodos();
    const deletePromises = completedTodos.map(todo => deleteTodo(todo));

    const results = await Promise.allSettled(deletePromises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        setCurrentTodos(prevTodos =>
          prevTodos.filter(t => t.id !== completedTodos[index].id),
        );
      } else {
        showError('Unable to delete a todo');
      }
    });

    setShouldDeleteCompleted(false);
    defaultInputRef.current?.focus();
  }, [shouldDeleteCompleted, getCompletedTodos, showError]);

  const updateChosenTodo = React.useCallback(
    (todoSetToUpdate: Todo | null) => {
      if (todoSetToUpdate) {
        updateTodo(todoSetToUpdate)
          .then(() => {
            setCurrentTodos(
              currentTodos.map(todo =>
                todo.id === todoSetToUpdate.id ? todoSetToUpdate : todo,
              ),
            );
          })
          .catch(() => {
            showError('Unable to update a todo');
          })
          .finally(() => {
            if (todoSetToUpdate === selectedTodo) {
              setSelectedTodo(undefined);
            }

            defaultInputRef.current?.focus();
          });
      }
    },
    [currentTodos, showError, selectedTodo],
  );

  const toggleTodoCompletedStatus = React.useCallback(async () => {
    if (shouldToggleAllCompleted) {
      let completed = false;

      if (getCompletedTodos().length < currentTodos.length) {
        completed = true;
      }

      const results = await Promise.allSettled(
        currentTodos.map(todo => {
          if (todo.completed !== completed) {
            updateTodo({
              id: todo.id,
              title: todo.title,
              userId: 2400,
              completed: completed,
            });
          }
        }),
      );

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          setCurrentTodos(prevTodos =>
            prevTodos.map(t => ({
              ...t,
              completed: completed,
            })),
          );
        } else {
          showError('Unable to update a todo');
        }
      });

      setShouldToggleAllCompleted(false);
      defaultInputRef.current?.focus();
    }
  }, [shouldToggleAllCompleted, showError, currentTodos, getCompletedTodos]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    toggleTodoCompletedStatus();
  }, [shouldToggleAllCompleted, toggleTodoCompletedStatus]);

  useEffect(() => {
    if (!todoBeingAdded) {
      defaultInputRef.current?.focus();
    }
  }, [todoBeingAdded]);

  useEffect(() => {
    getAndShowTodos();
  }, [getAndShowTodos]);

  useEffect(() => {
    deleteCompletedTodos();
  }, [shouldDeleteCompleted, deleteCompletedTodos]);

  useEffect(() => {
    focusedTodoRef.current?.focus();
  }, [focusedTodoRef, selectedTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          defaultInputRef={defaultInputRef}
          currentTodos={currentTodos}
          postNewTodo={postNewTodo}
          showError={showError}
          todoBeingAdded={todoBeingAdded}
          clearInput={clearInput}
          setClearInput={setClearInput}
          setShouldToggleAllCompleted={setShouldToggleAllCompleted}
        />

        <TodoList
          filteredTodos={filteredTodos}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          deleteChosenTodo={deleteChosenTodo}
          focusedTodoRef={focusedTodoRef}
          shouldDeleteCompleted={shouldDeleteCompleted}
          tempTodo={tempTodo}
          updateChosenTodo={updateChosenTodo}
          shouldToggleAllCompleted={shouldToggleAllCompleted}
          currentTodos={currentTodos}
        />

        {/* Hide the footer if there are no todos */}
        {currentTodos.length !== 0 && (
          <Footer
            currentTodos={currentTodos}
            todosFilter={todosFilter}
            setTodosFilter={setTodosFilter}
            setShouldDeleteCompleted={setShouldDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
