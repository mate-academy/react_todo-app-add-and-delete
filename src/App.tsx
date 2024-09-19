import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Todo } from './types/Todo';
import { FILTER } from './types/Filter';
import { ERROR } from './types/ErrorMessage';
import * as todoService from './api/todos';
import { focusInput } from './utils/inputFocus';

const filterByStatus = (todos: Todo[], selectedStatus: string) => {
  if (selectedStatus === FILTER.ACTIVE) {
    return todos.filter(todo => !todo.completed);
  }

  if (selectedStatus === FILTER.COMPLETED) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(FILTER.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoadingTodo, setIsLoadingTodo] = useState<boolean>(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(
    () => filterByStatus(todos, selectedStatus),
    [todos, selectedStatus],
  );
  const completedTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ERROR.LOAD);
      });
  }, []);

  useEffect(() => {
    focusInput(inputRef);
  });

  const addTodo = (newTitle: string) => {
    const editedTitle = newTitle.trim();

    if (!editedTitle) {
      setErrorMessage(ERROR.TITLE);

      return;
    }

    setIsDisabled(true);
    setIsLoadingTodo(true);

    const temporaryTodo = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(temporaryTodo);

    const todoToAdd = {
      title: editedTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    return todoService
      .addTodo(todoToAdd)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ERROR.ADD);
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
        setIsLoadingTodo(false);
      });
  };

  const deleteTodo = (id: number) => {
    setDeletingTodoId(id);

    return todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ERROR.DELETE);
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
          isDisabled={isDisabled}
          isLoadingTodo={isLoadingTodo}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          deletingTodoId={deletingTodoId}
          tempTodo={tempTodo}
          isLoadingTodo={isLoadingTodo}
        />

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            setSelectedStatus={setSelectedStatus}
            selectedStatus={selectedStatus}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
