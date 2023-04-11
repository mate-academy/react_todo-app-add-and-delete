/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodoOnServer, deleteTodoFromServer } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Status } from './enums/Status';
import { SingleTodo } from './components/SingleTodo';

const USER_ID = 7010;

function filteredTodos(todos: Todo[], status: Status) {
  if (status !== Status.All) {
    return [...todos].filter(todo => {
      return status === Status.Completed
        ? todo.completed
        : !todo.completed;
    });
  }

  return todos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [hasError, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const changeStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const loadTodos = useCallback(
    async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
        setError('');
      } catch {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
      }
    }, [getTodos],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  const vidibleTodos = filteredTodos(todos, status);

  const addTodo = useMemo(() => {
    return async (title: string) => {
      setLoading(true);
      if (!title) {
        setError('Title can t be empty');
        setTimeout(() => setError(''), 3000);
      }

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);

      try {
        await addTodoOnServer(newTodo);
        setTempTodo(newTodo);
        setTodos(currentTodos => [...currentTodos, newTodo]);
      } catch {
        setError('Unable to add todo!');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
        setTempTodo(null);
      }
    };
  }, [todos]);

  const deleteTodo = async (todoId: number) => {
    await deleteTodoFromServer(todoId);

    try {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteComplitedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(({ id }) => {
      deleteTodo(id);
    });

    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={vidibleTodos}
          onSubmit={addTodo}
          loaded={isLoading}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={vidibleTodos}
              onDeleteTodo={deleteTodo}
              loaded={isLoading}
            />
            {tempTodo && (
              <SingleTodo
                todo={tempTodo}
                onDelete={deleteTodo}
              />
            )}
            <Footer
              todos={vidibleTodos}
              selectedStatus={status}
              changeStatus={changeStatus}
              onDeleteCompletedTodos={deleteComplitedTodos}
            />
          </>
        )}
      </div>

      <Notification
        error={hasError}
        onClose={() => setError('')}
      />
    </div>
  );
};
