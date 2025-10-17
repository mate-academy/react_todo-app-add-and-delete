import { useEffect, useMemo, useState } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';
import { Todo } from '../../types/Todo';
import { ErrorCode } from '../../types/ErrorCode';
import * as todoService from '../../api/todos';
import { Filters } from '../../types/Filters';

type Props = {
  onShowError: (errorCode: Exclude<ErrorCode, null>) => void;
  onClearError: () => void;
};

function getPreparedTodos(
  currentTodos: Todo[],
  active: Todo[],
  completed: Todo[],
  filter: Filters,
): Todo[] {
  let preparedTodos: Todo[] = [];

  switch (filter) {
    case Filters.Active:
      preparedTodos = active;
      break;

    case Filters.Completed:
      preparedTodos = completed;
      break;

    case Filters.All:
    default:
      preparedTodos = [...currentTodos];
  }

  return preparedTodos;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const Content: React.FC<Props> = ({ onShowError, onClearError }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.All);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [focusSignal, setFocusSignal] = useState(0);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => onShowError('load_failed'));
  }, [onShowError]);

  const todosActive: Todo[] = useMemo(
    () => todos.filter(todo => todo.completed === false),
    [todos],
  );
  const todosCompleted: Todo[] = useMemo(
    () => todos.filter(todo => todo.completed === true),
    [todos],
  );

  const handleStatusUpdate = (id: number, completed: boolean) => {
    const previousTodos = todos;

    setUpdatingId(id);
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: completed } : todo,
      ),
    );

    todoService
      .updateTodoStatus({ id, completed })
      .then(() => {
        return wait(200);
      }) // .updateTodoStatus(id, completed) - коли передаємо не деструктурований обʼєкт
      .catch(() => {
        // якщо помилка — повертаємо попередній стан і показуємо помилку
        setTodos(previousTodos);
        onShowError('update_failed');

        setTimeout(() => {
          onClearError();
        }, 3000);
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  const handleFilterUpdate = (filter: Filters) => {
    setCurrentFilter(filter);
  };

  // const handleToggleAllButton = () => {
  //   const checkAllCompleted = todos.every(todo => todo.completed === true);

  //   const newStatus = checkAllCompleted ? false : true;

  //   setLoading(true);
  //   setTodos(currentTodos =>
  //     currentTodos.map(todo => ({
  //       ...todo,
  //       completed: newStatus,
  //     })),
  //   );

  //   todoService
  //     .updateToggleAll(todos, newStatus)
  //     .then(() => {
  //       return wait(200);
  //     })
  //     .catch(() => {
  //       setTodos(prev => prev.map(t => ({ ...t, completed: !newStatus })));
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const addTodo = (title: string) => {
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todoService.USER_ID,
    });

    return todoService
      .addTodo(title)
      .then(newTodo => {
        return wait(200).then(() => {
          setTodos(prev => [...prev, newTodo]);
        });
      })
      .catch(error => {
        onShowError('add_failed');
        setTimeout(() => {
          onClearError();
        }, 3000);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setUpdatingId(todoId);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        return wait(200);
      })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        // setTodos(todos);
        onShowError('delete_failed');
        setTimeout(() => {
          onClearError();
        }, 3000);

        throw error;
      })
      .finally(() => {
        setUpdatingId(null);
        setFocusSignal(prev => prev + 1);
      });
  };

  const clearCompletedTodo = () => {
    const completedIds = todosCompleted.map(todo => todo.id);

    setDeletingIds(prev => [...prev, ...completedIds]);

    return Promise.allSettled(
      completedIds.map(completedId =>
        todoService
          .deleteTodo(completedId)
          .then(() => wait(200))
          .then(() => {
            // прибрати з масиву по успіху
            setTodos(prev => prev.filter(todo => todo.id !== completedId));
          })
          .catch(() => {
            onShowError('delete_failed');
            setTimeout(onClearError, 3000);
          })
          .finally(() => {
            setDeletingIds(prev =>
              prev.filter(todoId => todoId !== completedId),
            );
          }),
      ),
    ).finally(() => {
      setFocusSignal(prev => prev + 1);
    });
  };

  const visibleTodos = useMemo(
    () => getPreparedTodos(todos, todosActive, todosCompleted, currentFilter),
    [todos, todosActive, todosCompleted, currentFilter],
  );

  return (
    <div className="todoapp__content">
      <Header
        focusSignal={focusSignal}
        todos={todos}
        // onToggleAllButton={handleToggleAllButton}
        onShowError={onShowError}
        onClearError={onClearError}
        onSubmit={addTodo}
      />
      <Main
        tempTodo={tempTodo}
        todos={visibleTodos}
        updatingId={updatingId}
        // loading={loading}
        // onShowError={onShowError}
        // onClearError={onClearError}
        onStatusUpdate={handleStatusUpdate}
        TodoDeleteButton={deleteTodo}
        deletingIds={deletingIds}
      />
      {/* Hide the footer if there are no todos */}
      {todos.length !== 0 && (
        <Footer
          onClearCompleted={clearCompletedTodo}
          currentFilter={currentFilter}
          todosActive={todosActive}
          todosCompleted={todosCompleted}
          onFilterChange={handleFilterUpdate}
        />
      )}
    </div>
  );
};
