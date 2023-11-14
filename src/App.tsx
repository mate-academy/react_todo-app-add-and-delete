import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Error } from './Error';
import { Header } from './Header';
import { TodoList } from './TodoList';
import * as postService from './api/todos';
import { Footer } from './Footer';
import { UserWarning } from './UserWarning';
import { Status } from './types/Status';

const USER_ID = 11853;

function getVisibleTodos(todos: Todo[], newStatus: Status) {
  switch (newStatus) {
    case Status.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Status.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
// if (!USER_ID) {
//   return <UserWarning />;
// }
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Status.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const visibleTodos = getVisibleTodos(todos, filter);

  const clearCompletedTodos = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setErrorMessage]);

  const loadTodos = () => {
    setErrorMessage('');
    postService.getTodos(USER_ID)
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        clearError();
      });
  };

  useEffect(() => {
    loadTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterById = (filteredTodos: Todo[], id: number) => {
    return filteredTodos.filter(todo => todo.id !== id);
  };

  const addTodo = ({ userId, title, completed }: Todo) => {
    setIsLoading(true);

    const promise = postService.addTodos({
      userId, title: title.trim(), completed,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });

    setTempTodo({
      id: 0, userId: USER_ID, title, completed,
    });

    return promise;
  };

  const deleteTodo = useCallback((todoId: number) => {
    setDeletingTodoId(todoId);
    postService.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos => filterById(currentTodos, todoId));
        setDeletingTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        clearError();
        setDeletingTodoId(null);
      });
  }, [setTodos, clearError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          isLoading={isLoading}
          userId={USER_ID}
          setErrorMessage={setErrorMessage}
          clearError={clearError}
        />

        {visibleTodos && (
          <TodoList
            tempTodo={tempTodo}
            isLoading={isLoading}
            visibleTodos={visibleTodos}
            deleteTodo={deleteTodo}
            deletingTodoId={deletingTodoId}
          />
        )}

        {(todos.length > 0 || tempTodo) && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            currentFilter={filter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
