/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoError } from './components/TodoError';
import { TodoFooter } from './components/TodoFooter';
import { TodoSection } from './components/TodoSection';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';

interface AppProp {
  todoId: number;
}

export enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC<AppProp> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryTodo, setQueryTodo] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    setIsInputDisabled(true);

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    try {
      const newTodo = await addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos([...todos, newTodo]);
      setTempTodo(null);
      setQueryTodo('');
    } catch (e) {
      setError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);
      setIsInputDisabled(false);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
      ).then(values => {
        values.map(value1 => {
          if (value1.status === 'rejected') {
            setError('Unable to delete a todo');
          } else {
            setTodos(prevTodos => {
              const todoID = value1.value as Todo;

              return prevTodos.filter(todo1 => todo1.id !== todoID.id);
            });
          }
        });
      });
    } catch (e) {
      setError('Unable to delete todos');
    } finally {
      setIsInputDisabled(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoLeft = todos.filter(todo => !todo.completed).length;

  const noTodo = todos.length === 0;

  useEffect(() => {
    if (USER_ID) {
      getTodos()
        .then(data => {
          setTodos(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Unable to load todos');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isInputDisabled={isInputDisabled}
          handleAddTodo={handleAddTodo}
          setQueryTodo={setQueryTodo}
          queryTodo={queryTodo}
          error={error}
          setError={setError}
          inputRef={inputRef}
        />
        {loading ? (
          <div></div>
        ) : (
          <TodoSection
            todos={filteredTodos}
            handleDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            deletingTodoId={deletingTodoId}
          />
        )}
        {!noTodo && (
          <TodoFooter
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            filter={filter}
            setFilter={setFilter}
            todoLeft={todoLeft}
          />
        )}
      </div>

      <TodoError error={error} setError={setError} />
    </div>
  );
};
