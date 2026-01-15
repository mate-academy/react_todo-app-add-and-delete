/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/sortField';
import { ErrorField } from './types/errorField';
import { AddBar } from './components/AddBar/AddBar';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorMessage/ErrorNotification';

export const App: React.FC = () => {
  //#region states

  const todoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleted, setIsDeleted] = useState<Set<number>>(new Set()); // is chsnging for rendering condition
  const [query, setQuery] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  // const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<SortType>(SortType.default);

  const completedCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const inputFocus = () => {
    todoField.current?.focus();
  };

  const isHeaderButtonActive = todos.every(todo => todo.completed);
  const isFooterButtonDisabled = !todos.some(todo => todo.completed === true);

  //#endregion

  useEffect(() => {
    inputFocus();

    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setErrorMessage(ErrorField.loadError);
      });
  }, []);

  //#region error

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    setIsErrorVisible(true);

    const timer = setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleErrorClose = () => {
    setIsErrorVisible(false);
    setErrorMessage('');
  };
  //#endregion

  //#region handels
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorMessage(ErrorField.emptyTitle);

      return Promise.resolve();
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    if (todoField.current) {
      todoField.current.disabled = true;
    }

    setTempTodo({ ...newTodo, id: 0 });

    return createTodo({ ...newTodo })
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorField.addError);
      })
      .finally(() => {
        setTempTodo(null);
        todoField.current!.disabled = false;
        inputFocus();
      });
  };

  const handleFilter = (field: SortType) => {
    setSortField(field);
  };

  const handleDelete = (todoId: number) => {
    setIsDeleted(currSet => {
      const newSet = new Set(currSet);

      newSet.add(todoId);

      return newSet;
    });

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorField.deleteError);
      })
      .finally(() => {
        setIsDeleted(currSet => {
          const newSet = new Set(currSet);

          newSet.delete(todoId);

          return newSet;
        });
        inputFocus();
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const handleDeleteCompetedTodos = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(comleteTodo => comleteTodo.id);

    setIsDeleted(currSet => {
      const newSet = new Set(currSet);

      completedTodosId.forEach(id => newSet.add(id));

      return newSet;
    });

    const deletePromises = completedTodosId.map(id => deleteTodo(id));

    Promise.allSettled(deletePromises).then(results => {
      inputFocus();
      const successId = completedTodosId.filter((id, i) => {
        return results[i].status === 'fulfilled';
      });
      const failedId = completedTodosId.filter((id, i) => {
        return results[i].status === 'rejected';
      });

      if (successId.length > 0) {
        setTodos(curr =>
          curr.filter(oldTodo => !successId.includes(oldTodo.id)),
        );
      }

      if (failedId.length > 0) {
        setErrorMessage(ErrorField.deleteError);
      }

      setIsDeleted(currSet => {
        const newSet = new Set(currSet);

        completedTodosId.forEach(id => newSet.delete(id));

        return newSet;
      });
    });
  };
  // #endregion

  const visibleTodos = useMemo(() => {
    const copyTodos = [...todos];

    switch (sortField) {
      case SortType.active:
        return copyTodos.filter(todo => !todo.completed);
      case SortType.completed:
        return copyTodos.filter(todo => todo.completed);
      case SortType.default:
      default:
        return copyTodos;
    }
  }, [todos, sortField]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddBar
          todoField={todoField}
          query={query}
          isActive={isHeaderButtonActive}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
          onQueryChange={handleQueryChange}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isDeleted={isDeleted}
          onDelete={handleDelete}
        />

        {todos.length > 0 && (
          <Footer
            count={completedCount}
            isDisabled={isFooterButtonDisabled}
            onDelete={handleDeleteCompetedTodos}
            sortField={sortField}
            onFilter={handleFilter}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        isVisible={isErrorVisible}
        onClose={handleErrorClose}
      />
    </div>
  );
};
