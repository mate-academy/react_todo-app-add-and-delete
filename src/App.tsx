/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterTypes } from './types/FilterTypes';
import { Header } from './components/Header';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const USER_ID = 2811;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);
  const [filterType, setFilterType] = useState(FilterTypes.ALL);
  const [inputValue, setInputValue] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(allTodos => {
        setTodos(allTodos);
      })
      .catch(() => setErrorMessage(ErrorMessage.LOAD_DATA))
      .finally(() => {
        setIsLoadingAll(false);
        inputRef.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (errorMessage !== ErrorMessage.NONE) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessage.NONE);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const visibleTodos: Todo[] = todos?.filter(todo => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return !todo.completed;
      case FilterTypes.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const allCompletedTodos: boolean = todos?.every(
    todo => todo.completed === true,
  );
  const uncompletedTodos: Todo[] = todos.filter(todo => !todo.completed);

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = inputValue.trim();

    if (!trimedTitle) {
      setErrorMessage(ErrorMessage.TITLE_EMPTY);

      return;
    }

    const tempId = Date.now();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimedTitle,
      completed: false,
    };

    setLoadingIds(prev => [...prev, tempId]);
    setTempTodo(newTodo);
    postTodo(newTodo)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UNABLE_ADD);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== tempId));
        setTempTodo(null);
      });
  };

  const handleClearCompleted = async () => {
    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    const successfulIds: number[] = [];

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        successfulIds.push(todo.id);
      } catch {
        setErrorMessage(ErrorMessage.UNABLE_DELETE);
      }
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );

    setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
    inputRef.current?.focus();

    // try {
    //   await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    //   setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    // } catch {
    //   setErrorMessage(ErrorMessage.UNABLE_DELETE);
    // } finally {
    //   setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
    //   inputRef.current?.focus();
    // }
  };

  const handleDeletTodo = (todoDelete: Todo) => {
    setLoadingIds(prev => [...prev, todoDelete.id]);

    deleteTodo(todoDelete.id)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos?.filter(todo => todo.id !== todoDelete.id),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UNABLE_DELETE);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoDelete.id));
        inputRef.current?.focus();
      });
  };

  const handleChecked = (todoToToggle: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoToToggle.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      ),
    );
  };

  const handleHiddeErrorMessage = () => {
    setErrorMessage(ErrorMessage.NONE);
  };

  const handleFilterType = (type: FilterTypes) => {
    setFilterType(type);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addingTodo={tempTodo}
          inputValue={inputValue}
          inputRef={inputRef}
          allCompletedTodos={allCompletedTodos}
          handleSubmitForm={handleSubmitForm}
          handleInputValue={handleInputValue}
        />

        <TodosList
          todos={[...visibleTodos, ...(tempTodo ? [tempTodo] : [])]}
          handleDeletTodo={handleDeletTodo}
          handleChecked={handleChecked}
          loadingIds={loadingIds}
          isLoadingAll={isLoadingAll}
        />

        {/* Hide the footer if there are no todos */}
        {todos?.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodos}
            filterType={filterType}
            handleFilterType={handleFilterType}
            handleClearCompleted={handleClearCompleted}
            todos={todos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        handleHiddeErrorMessage={handleHiddeErrorMessage}
      />
    </div>
  );
};
