/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo, TodoStatus } from './types/Todo';
import { ErrorNotification } from './ErrorNotification';
import { TodosList } from './TodosList';
import { TodosHeader } from './TodosHeader';
import { TodosFooter } from './TodosFooter';

const USER_ID = 10332;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);
  const [todoAddQuery, setTodoAddQuery] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const loadTodos = async () => {
    try {
      const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

      setTodos(response);
    } catch {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (event:React.FormEvent) => {
    event.preventDefault();

    if (!todoAddQuery) {
      setError("Title can't be empty");

      return;
    }

    setLoadingTodoId(0);
    setDisableInput(true);
    setTodoAddQuery('');
    setTempTodo({
      id: 0,
      title: todoAddQuery,
      completed: false,
      userId: USER_ID,
    });

    try {
      const response = await client.post<Todo>('/todos', {
        title: todoAddQuery,
        userId: USER_ID,
        completed: false,
      });

      setTodos([...todos, response]);
      setTempTodo(null);
      setLoadingTodoId(null);
    } catch {
      setError('Unable to add todo');
    }

    setDisableInput(false);
  };

  const deleteTodo = async (id:number) => {
    setLoadingTodoId(id);

    try {
      await client.delete(`/todos/${id}`);

      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete todo');
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      await Promise.all(todos
        .filter(todo => todo.completed)
        .map(todo => client.delete(`/todos/${todo.id}`)));

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete completed todos');
    }
  };

  const handleStatusFilter = useCallback(
    (status: TodoStatus) => {
      setStatusFilter(status);
    }, [],
  );

  const handleInputTodo = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTodoAddQuery(event.target.value.trim());
  };

  let preparedTodos = todos;

  if (statusFilter) {
    preparedTodos = preparedTodos.filter(todo => {
      switch (statusFilter) {
        case TodoStatus.Uncompleted:
          return !todo.completed;
        case TodoStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }

  const completedTodosLength = preparedTodos
    .filter(todo => todo.completed).length;

  const uncompletedTodosLength = preparedTodos
    .filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          uncompletedTodosLength={uncompletedTodosLength}
          todoAddQuery={todoAddQuery}
          onInput={handleInputTodo}
          onSubmit={addTodo}
          disableInput={disableInput}
        />

        <TodosList
          todos={preparedTodos}
          tempTodo={tempTodo}
          loadingTodoId={loadingTodoId}
          onDelete={deleteTodo}
        />

        {todos.length > 0 && (
          <TodosFooter
            onStatusFilter={handleStatusFilter}
            todosQuantity={todos.length}
            statusFilter={statusFilter}
            completedTodosLength={completedTodosLength}
            onDeleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
        />
      )}
    </div>
  );
};
