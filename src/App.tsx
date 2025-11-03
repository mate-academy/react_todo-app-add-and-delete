/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodosBar } from './components/TodosBar';
import { TodoFilter } from './components/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { FilterBy } from './types/Filter';
import { AddBar } from './components/AddBar';
import { TypeErrMes } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<TypeErrMes | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<Set<number | number[]>>(new Set());

  const activeTodosCount = todos.reduce(
    (count, todo) => count + Number(!todo.completed),
    0,
  );
  const hasCompleteTodosId = todos
    .filter(todo => todo.completed)
    .map(comleteTodo => comleteTodo.id);

  const mainField = useRef<HTMLInputElement>(null);

  const createTempTodo = (title: string) => {
    const TempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    };

    setTempTodo(TempTodo);
  };

  const addNewTodo = (newTodo: Todo) => {
    setTodos(currTodos => [...currTodos, newTodo]);
  };

  const createTodo = (title: string, clearTitle: () => void) => {
    setErrorMessage(null);
    const parseTitle = title.trim();

    if (parseTitle) {
      setIsCreating(true);
      createTempTodo(parseTitle);
      const newTodo = { userId: USER_ID, title: parseTitle, completed: false };

      postTodo(newTodo)
        .then(addTodo => {
          clearTitle();
          setTempTodo(null);
          addNewTodo(addTodo);
        })
        .catch(() => {
          setErrorMessage(TypeErrMes.UnableAdd);
          setTempTodo(null);
        })
        .finally(() => {
          setIsCreating(false);
        });
    } else {
      setErrorMessage(TypeErrMes.TitleNotBeEmpty);
    }
  };

  const onDeleteErrorMessage = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const filtertTodos = useMemo<Todo[]>(() => {
    switch (filter) {
      case FilterBy.All:
        return todos;
      case FilterBy.Active:
        return todos.filter(todo => !todo.completed);
      case FilterBy.Completed:
        return todos.filter(todo => todo.completed);
    }
  }, [filter, todos]);

  const delTodo = (todoId: number) => {
    setErrorMessage(null);
    setIsDeleted(currSet => {
      const newSet = new Set(currSet);

      newSet.add(todoId);

      return newSet;
    });

    return deleteTodo(todoId)
      .then(() => {
        setTodos(curr => curr.filter(oldTodo => oldTodo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(TypeErrMes.UnableDelete);
      })
      .finally(() => {
        setIsDeleted(currSet => {
          const newSet = new Set(currSet);

          newSet.delete(todoId);

          return newSet;
        });
      });
  };

  const deleteAllCompleteTodos = () => {
    if (hasCompleteTodosId.length === 0) {
      return;
    }

    const idToDelete = [...hasCompleteTodosId];

    setIsDeleted(curr => {
      const newSet = new Set(curr);

      idToDelete.forEach(id => newSet.add(id));

      return newSet;
    });

    const deleteTodos = idToDelete.map(todoId =>
      deleteTodo(todoId)
        .then(() => ({ id: todoId, success: true }))
        .catch(() => ({ id: todoId, success: false })),
    );

    Promise.all(deleteTodos).then(results => {
      const successIds = results.filter(r => r.success).map(r => r.id);
      const failedCount = results.reduce(
        (count, todoRes) => count + Number(!todoRes.success),
        0,
      );

      if (successIds.length > 0) {
        setTodos(curr => curr.filter(todo => !successIds.includes(todo.id)));
      }

      if (failedCount > 0) {
        setErrorMessage(TypeErrMes.UnableDelete);
      }

      setIsDeleted(curr => {
        const newSet = new Set(curr);

        idToDelete.forEach(id => newSet.delete(id));

        return newSet;
      });
    });
  };

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(TypeErrMes.UnableLoad));
  }, []);

  useEffect(() => {
    mainField.current?.focus();
  }, [isDeleted, isCreating]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddBar
          createTodo={createTodo}
          activeTodosCount={activeTodosCount}
          isCreating={isCreating}
          mainField={mainField}
        />

        <TodosBar
          todos={filtertTodos}
          tempTodo={tempTodo}
          delTodo={delTodo}
          isDeleted={isDeleted}
        />

        {todos.length > 0 && (
          <TodoFilter
            hasCompleteTodosId={hasCompleteTodosId}
            activeTodosCount={activeTodosCount}
            selectFilter={filter}
            onFilter={setFilter}
            deleteAllCompleteTodos={deleteAllCompleteTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onDeleteErrorMessage={onDeleteErrorMessage}
      />
    </div>
  );
};
