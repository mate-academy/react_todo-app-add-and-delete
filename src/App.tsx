/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Filter } from './Filter';
import { CustomNotification } from './components/CustomNotification';
import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotificationHidden, setIsNotificationHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsNotificationHidden(false);

    setTimeout(() => {
      setErrorMessage('');
      setIsNotificationHidden(true);
    }, 3000);
  };

  const filterTodos = useCallback((todos: Todo[], filterBy: Filter): Todo[] => {
    switch (filterBy) {
      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, []);

  const visibleTodos = useMemo(
    () => filterTodos(todosFromServer, filter),
    [filterTodos, todosFromServer, filter],
  );

  const activeTodosCount = useMemo(
    () => todosFromServer.filter(todo => !todo.completed).length,
    [todosFromServer],
  );

  const allTodosCompleted = useMemo(
    () => activeTodosCount === 0,
    [activeTodosCount],
  );

  const hasCompletedTodos = useMemo(
    () => todosFromServer.some(todo => todo.completed),
    [todosFromServer],
  );

  const handleAddTodo = (title: string) => {
    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      showErrorMessage('Title should not be empty');

      return Promise.reject('Title is empty');
    }

    setTempTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    return todoService
      .createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodosFromServer(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        showErrorMessage('Unable to add a todo');
        throw new Error(error);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds([todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(curr => curr.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showErrorMessage('Unable to delete a todo');
        throw new Error(error);
      })
      .finally(() => {
        setDeletingTodoIds([]);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleClearCompletedTodos = () => {
    const completedTodoIds = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodoIds(completedTodoIds);
    Promise.all(
      completedTodoIds.map(id =>
        todoService
          .deleteTodo(id)
          .then(() => {
            setTodosFromServer(curr => curr.filter(todo => todo.id !== id));
          })
          .catch(error => {
            showErrorMessage('Unable to delete a todo');
            throw new Error(error);
          })
          .finally(() => {
            setDeletingTodoIds([]);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }),
      ),
    );
  };

  useEffect(() => {
    getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={allTodosCompleted}
          onAdd={handleAddTodo}
          inputRef={inputRef}
        />

        {!!todosFromServer.length && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            deletingTodoIds={deletingTodoIds}
          />
        )}

        {!!todosFromServer.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            currFilter={filter}
            hasCompletedTodos={hasCompletedTodos}
            onFilterClick={setFilter}
            onClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <CustomNotification
        errorMessage={errorMessage}
        isNotificationHidden={isNotificationHidden}
        onClose={setIsNotificationHidden}
      />
    </div>
  );
};
