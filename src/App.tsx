import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';

// type Errors = 'upload' | 'title' | 'add' | 'delete' | 'update' | '';
enum Errors {
  Upload = 'upload',
  Title = 'title',
  Add = 'add',
  Delete = 'delete',
  Update = 'update',
  None = '',
}

enum FiltersParam {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadTodos, setLoadTodos] = useState<boolean>(false);
  const [hasError, setHasError] = useState<Errors>(Errors.None);
  const [filter, setFilter] = useState<FiltersParam>(FiltersParam.All);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [allTodosCount, setAllTodosCount] = useState<number>(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [processings, setProcessings] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [errorTimestamp, setErrorTimestamp] = useState(0);

  function showError(error: Errors) {
    setHasError(error);
    setErrorTimestamp(Date.now());
  }

  useEffect(() => {
    setLoadTodos(true);
    setHasError(Errors.None);
    setCompletedTodos([]);

    getTodos()
      .then(data => {
        setAllTodosCount(data.length);

        const filteredData = data.filter(todo => {
          switch (filter) {
            case FiltersParam.Completed:
              return todo.completed === true;
            case FiltersParam.Active:
              return todo.completed === false;
            case FiltersParam.All:
            default:
              return todo;
          }
        });

        const finishedTodos: Todo[] = data.filter(todo => todo.completed);

        setCompletedTodos(finishedTodos);

        setTodos(filteredData);
      })
      .catch(error => {
        setHasError(Errors.Upload);
        throw error;
      })
      .finally(() => {
        setLoadTodos(false);
      });
  }, [filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onCreateTodo(title: string) {
    setIsSubmitting(true);
    setHasError(Errors.None);

    const newTemp = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTemp);

    addTodos(newTemp)
      .then((created: Todo | Todo[]) => {
        const createdTodo: Todo | undefined = Array.isArray(created)
          ? created[0]
          : created;

        if (!createdTodo) {
          setHasError(Errors.Add);

          return;
        }

        setTodos(prev => [...prev, createdTodo]);
        setTodoTitle('');
        setAllTodosCount(prev => prev + 1);
      })
      .catch(error => {
        setHasError(Errors.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  }

  function onDeleteTodo(id: number) {
    setProcessings(prev => [...prev, id]);

    deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setAllTodosCount(prev => prev - 1);
        setFocusTrigger(prev => prev + 1);
      })
      .catch(error => {
        setHasError(Errors.Delete);
        throw error;
      })
      .finally(() => {
        setProcessings(prev => prev.filter(pid => pid !== id));
      });
  }

  function onDeleteCompletedTodos() {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    const promises = completedIds.map(id => {
      setProcessings(prev => [...prev, id]);

      return deleteTodos(id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== id));
          setAllTodosCount(prev => prev - 1);
          setCompletedTodos(prev => prev.filter(t => t.id !== id)); // ← оновлюємо completedTodos
          setFocusTrigger(prev => prev + 1);
        })
        .catch(() => {
          return Promise.reject(id);
        })
        .finally(() => {
          setProcessings(prev => prev.filter(pid => pid !== id));
        });
    });

    Promise.allSettled(promises).then(results => {
      if (results.some(r => r.status === 'rejected')) {
        setHasError(Errors.Delete);
      }
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          allTodosCount={allTodosCount}
          completedCount={completedTodos.length}
          todoTitle={todoTitle}
          setTodoTitle={(newTitle: string) => setTodoTitle(newTitle)}
          onCreateTodo={(title: string) => onCreateTodo(title)}
          setHasError={(error: Errors) => setHasError(error)}
          isSubmitting={isSubmitting}
          focusTrigger={focusTrigger}
        />

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          processings={processings}
          onDeleteTodo={(id: number) => onDeleteTodo(id)}
        />

        <TodoFooter
          allTodosCount={allTodosCount}
          todoLeft={allTodosCount - completedTodos.length}
          filter={filter}
          setFilter={(newFilter: FiltersParam) => setFilter(newFilter)}
          onDeleteCompletedTodos={onDeleteCompletedTodos}
        />
      </div>

      <ErrorNotification
        hasError={hasError}
        loadTodos={loadTodos}
        errorTimestamp={errorTimestamp}
        setHasError={showError}
      />
    </div>
  );
};
