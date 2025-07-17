/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorMessage } from './components/TodoErrorMessage';
import { TodoItem } from './components/TodoItem';

type TodoStatus = 'all' | 'active' | 'completed';

const filterTodos = (todos: Todo[], status: TodoStatus): Todo[] => {
  if (status === 'active') {
    return todos.filter(todo => !todo.completed);
  }

  if (status === 'completed') {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<TodoStatus>('all');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (!todoService.USER_ID) {
      return;
    }

    const load = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const loadedTodos = await todoService.getTodos();

        setTodos(loadedTodos);
        setVisibleTodos(loadedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    setVisibleTodos(filterTodos(todos, status));
  }, [todos, status]);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const createTodo = async (title: string) => {
    const optimisticTodo: Todo = {
      id: 0,
      title,
      userId: todoService.USER_ID,
      completed: false,
    };

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo(optimisticTodo);

    try {
      const createdTodo = await todoService.createTodo(optimisticTodo);

      setTodos(current => [...current, createdTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const deleteTodo = async (id: number) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setDeletingTodoIds(currentIds => [...currentIds, id]);
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsSubmitting(false);
      setDeletingTodoIds([]);
    }
  };

  const deleteCompletedTodos = async (ids: number[]) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setDeletingTodoIds(currentIds => [...currentIds, ...ids]);

    try {
      const results = await Promise.allSettled(
        ids.map(id => todoService.deleteTodo(id)),
      );

      const successfulIds: number[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulIds.push(ids[index]);
        }
      });

      if (successfulIds.length > 0) {
        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );
      }

      const hasFailures = results.some(result => result.status === 'rejected');

      if (hasFailures) {
        setErrorMessage('Unable to delete a todo');
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsSubmitting(false);
      setDeletingTodoIds(currentIds =>
        currentIds.filter(id => !ids.includes(id)),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isSubmitting={isSubmitting}
          onCreate={createTodo}
          onError={setErrorMessage}
        />

        {!loading && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={deleteTodo}
              deletingTodoIds={deletingTodoIds}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isSubmitting={isSubmitting}
                onDelete={() => {}}
              />
            )}
          </>
        )}

        {!loading && todos.length > 0 && (
          <TodoFooter
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onDeleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>
      <TodoErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
