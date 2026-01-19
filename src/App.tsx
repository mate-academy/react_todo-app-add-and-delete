/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos, createTodoApi, deleteTodoApi } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterTodo } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoError } from './types/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessages, setErrorMessages] = useState<TodoError[]>([]);
  const [isHidden, setIsHidden] = useState(true);
  const [filter, setFilter] = useState<FilterTodo>(FilterTodo.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessages([]);
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessages([TodoError.LoadTodos]);
        setIsHidden(false);
        setTimeout(() => setIsHidden(true), 3000);
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  }, []);

  const addTodo = (title: string, onSuccess?: () => void) => {
    if (title.trim() === '') {
      setErrorMessages([TodoError.EmptyTitle]);
      setIsHidden(false);
      setTimeout(() => setIsHidden(true), 3000);

      return;
    }

    const temporaryTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({ ...temporaryTodo, id: 0 });
    setIsLoadingTodos(true);

    createTodoApi(temporaryTodo)
      .then(createdTodo => {
        setTodos(prevTodo => [...prevTodo, createdTodo]);
        setTempTodo(null);
        onSuccess?.();
      })
      .catch(() => {
        setErrorMessages([TodoError.AddTodo]);
        setIsHidden(false);
        setTimeout(() => setIsHidden(true), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodo =>
      prevTodo.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    setIsLoadingTodos(true);
    deleteTodoApi(todoId)
      .then(() => {
        setTodos(prevTodo => prevTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessages([TodoError.DeleteTodo]);
        setIsHidden(false);
        setTimeout(() => setIsHidden(true), 3000);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        setIsLoadingTodos(false);
      });
  };

  const clearCompleted = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    setIsLoadingTodos(true);
    Promise.allSettled(completedTodo.map(todo => deleteTodoApi(todo.id)))
      .then(res => {
        const successTodo = completedTodo
          .filter((_, ind) => res[ind].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(prevTodo =>
          prevTodo.filter(todo => !successTodo.includes(todo.id)),
        );

        if (res.some(r => r.status === 'rejected')) {
          setErrorMessages([TodoError.DeleteTodo]);
          setIsHidden(false);
          setTimeout(() => setIsHidden(true), 3000);
        }
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
          todos={todos}
          isLoadingTodos={isLoadingTodos}
        />

        <TodoList
          todos={todos}
          isLoadingTodos={isLoadingTodos}
          filter={filter}
          loadingTodoIds={loadingTodoIds}
          onToggle={toggleTodo}
          onDeleteTodo={deleteTodo}
        />

        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            isLoadingTodos={isLoadingTodos}
            onToggle={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        messages={errorMessages}
        hidden={isHidden}
        onClose={() => setIsHidden(true)}
      />
    </div>
  );
};
