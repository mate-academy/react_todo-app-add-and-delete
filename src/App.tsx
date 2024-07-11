import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { List } from './components/List';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { ErrorType } from './types/ErrorType';
import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos(todoService.USER_ID)
      .then(setTodos)
      .catch(() => {
        handleError(ErrorType.LOAD_TODOS);

        return <UserWarning />;
      });
  }, []);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current?.focus();
    }
  }, [todos]);

  const addTodo = (newTodoTitle: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError(ErrorType.EMPTY_TITLE);

      return;
    }

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    setTempTodo({
      title: newTodoTitle,
      completed: false,
      userId: todoService.USER_ID,
      id: 0,
    });

    setLoadingTodos(current => [...current, 0]);
    todoService
      .addTodo({
        title: trimmedTitle,
        userId: todoService.USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => handleError(ErrorType.ADD_TODO))
      .finally(() => {
        if (titleField.current) {
          titleField.current.disabled = false;
          titleField.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(false);
    todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => handleError(ErrorType.DELETE_TODO))
      .finally(() => {
        setIsDeleting(false);
        setLoadingTodos(current =>
          current.filter(deletedTodoId => todoId !== deletedTodoId),
        );
      });
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteCompleted = () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);
    const requests: Promise<unknown>[] = [];

    completedTodosIds.forEach(todoId =>
      requests.push(todoService.deleteTodo(todoId)),
    );
    setLoadingTodos(current => [...current, ...completedTodosIds]);
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  function getVisibleTodos(newTodos: Todo[], newFilter: Filter) {
    switch (newFilter) {
      case Filter.Active:
        return newTodos.filter(todo => !todo.completed);

      case Filter.Completed:
        return newTodos.filter(todo => todo.completed);

      default:
        return newTodos;
    }
  }

  const visibleTodos = getVisibleTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          titleField={titleField}
          setTitle={setTitle}
          title={title}
        />
        <List
          visibleTodos={visibleTodos}
          handleDeleteTodo={isDeleting ? () => {} : handleDeleteTodo}
          loadingTodos={loadingTodos}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>
      <Error error={errorMessage} setError={handleError} />
    </div>
  );
};
