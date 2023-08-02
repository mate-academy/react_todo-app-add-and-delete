import React, {
  FormEvent, useEffect, useMemo, useState,
} from 'react';
import { TodoHeader } from './Components/TodoHeader';
import { TodoFooter } from './Components/TodoFooter';
import { Todo } from './types/Todo';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { ErrorNotification } from './Components/ErrorNotification';
import { Filter } from './types/Filter';
import { ErrorStatus } from './types/ErrorStatus';
import { USER_ID } from './utils/constants';
import { TodoList } from './Components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorStatus.Load);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        switch (filterType) {
          case Filter.Active: return !todo.completed;
          case Filter.Completed: return todo.completed;
          default: return true;
        }
      });
  }, [todos, filterType]);

  // #region header
  const [title, setTitle] = useState('');

  const allTodosCompleted = useMemo(() => {
    return preparedTodos.every(todo => todo.completed);
  }, [todos]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage(ErrorStatus.Title);

      return;
    }

    const newTodo = { title, userId: USER_ID, completed: false };

    setTempTodo({ ...newTodo, id: 0 });

    const handleThen = () => {
      getTodos(USER_ID)
        .then((value) => {
          setTodos(value);
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorStatus.Load);
        });
    };

    createTodo(newTodo)
      .then(handleThen)
      .catch(() => {
        setErrorMessage(ErrorStatus.Add);
      });
  };
  // #endregion
  // #region list

  const handleDelete = (todoId: number) => {
    setCompletedIds(currIds => [...currIds, todoId]);

    const handleThen = () => {
      getTodos(USER_ID)
        .then((value) => {
          setTodos(value);
          setCompletedIds(currIds => currIds.filter(id => todoId !== id));
        });
    };

    removeTodo(todoId)
      .then(handleThen)
      .catch(() => {
        setErrorMessage(ErrorStatus.Delete);
      });
  };
  // #endregion
  // #region footer

  const completedTodosCount = useMemo(() => {
    return preparedTodos.filter(todo => todo.completed).length;
  }, [todos]);

  const uncompletedTodosCount = useMemo(() => {
    return preparedTodos.filter(todo => !todo.completed).length;
  }, [todos]);

  const deleteCompletedTodos = () => {
    const completedTodos = preparedTodos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setCompletedIds(ids => [...ids, ...completedTodosIds]);

    const handleThen = () => {
      getTodos(USER_ID)
        .then((data) => {
          setTodos(data);
          setCompletedIds([]);
        })
        .catch(() => {
          setErrorMessage(ErrorStatus.Load);
        });
    };

    completedTodos.forEach(todo => {
      removeTodo(todo.id)
        .then(handleThen)
        .catch(() => {
          setErrorMessage(ErrorStatus.Delete);
        });
    });
  };
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={preparedTodos}
          allTodosCompleted={allTodosCompleted}
          handleFormSubmit={handleFormSubmit}
          title={title}
          handleTitleChange={setTitle}
        />

        {todos.length > 0 && (
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
            completedIds={completedIds}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            filterType={filterType}
            setFilterType={setFilterType}
            completedTodosCount={completedTodosCount}
            uncompletedTodosCount={uncompletedTodosCount}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

    </div>
  );
};
