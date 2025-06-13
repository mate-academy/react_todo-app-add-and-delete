/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { USER_ID } from './constants';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoServiceErrors } from './types/TodoServiceErrors';
import { TodoFooter } from './components/TodoFooter';
import { TodoListSection } from './components/TodoListSection';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todosErrorMessage, setTodosErrorMessage] =
    useState<TodoServiceErrors | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const isAdding = tempTodo !== null;

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    setTodosErrorMessage(null);
    setIsLoading(true);

    getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToLoad);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getFilteredTodos = (todos: Todo[], filter: FilterStatus): Todo[] => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  };

  const filteredTodos = getFilteredTodos(todosFromServer, filterStatus);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setTodosErrorMessage(TodoServiceErrors.TitleEmpty);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo(newTempTodo)
      .then(createdTodo => {
        setTodosFromServer(currentTodo => [...currentTodo, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToAddTodo);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleNewTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(currrentIds => [...currrentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToDeleteTodo);
      })
      .finally(() => {
        setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const completedTodos = todosFromServer.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const idsToDelete = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodoIds(currentIds => [...currentIds, ...idsToDelete]);

    Promise.allSettled(idsToDelete.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(idsToDelete[index]);
          } else {
            setTodosErrorMessage(TodoServiceErrors.UnableToDeleteTodo);
          }
        });

        setTodosFromServer(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setDeletingTodoIds(ids => ids.filter(id => !idsToDelete.includes(id)));
        inputRef.current?.focus();
      });
  };

  const activeTodosCount = useMemo(() => {
    return todosFromServer.filter(todo => !todo.completed).length;
  }, [todosFromServer]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          inputRef={inputRef}
          onNewTodoTitleChange={handleNewTodoTitleChange}
          onSubmit={handleSubmit}
        />

        {isLoading ? (
          <div className="todoapp__main" data-cy="TodosLoader">
            <div className="loader" />
          </div>
        ) : (
          <TodoListSection
            todos={filteredTodos}
            deletingTodoIds={deletingTodoIds}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

        {todosFromServer.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onClearCompleted={handleClearCompleted}
            hasCompletedTodos={completedTodos}
          />
        )}
      </div>

      <ErrorNotification
        message={todosErrorMessage}
        onClose={() => setTodosErrorMessage(null)}
      />
    </div>
  );
};
