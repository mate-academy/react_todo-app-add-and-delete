import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { Todo, TodoData } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { ErrorMessage, FilterStatus } from './components/enums/enums';
import { TodoItem } from './components/TodoItem/TodoItem';

const filterTodos = (todos: Todo[], status: FilterStatus) => {
  let filteredTodos = [...todos];

  if (status === FilterStatus.Active) {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (status === FilterStatus.Completed) {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [statusValue, setStatusValue] = useState(FilterStatus.All);
  const [error, setError] = useState('');
  const [todoTitleValue, setTodoTitleValue] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [todosDeleting, setTodosDeleting] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosCompleted = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const todosActive = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const showErrorContainer = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setTodos(await getTodos());
      } catch {
        showErrorContainer(ErrorMessage.Load);
      }
    }

    fetchData();
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, statusValue);
  }, [todos, statusValue]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = todoTitleValue.trim();

    if (!cleanTitle) {
      showErrorContainer(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodoData: TodoData = {
      title: cleanTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsAddingTodo(true);

    addTodo(newTodoData)
      .then(todo => {
        setTodoTitleValue('');
        setTodos(prev => [...prev, todo]);
      })
      .catch(() => {
        showErrorContainer(ErrorMessage.Add);
      })
      .finally(() => {
        setIsAddingTodo(false);
        setTempTodo(null);
      });

    setTempTodo({ ...newTodoData, id: 0 });
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    setTodosDeleting(prev => [...prev, todoId]);

    try {
      await removeTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showErrorContainer(ErrorMessage.Delete);
    } finally {
      setTodosDeleting(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const todoIdsToDelete = completedTodos.map(todo => todo.id);

    setTodosDeleting(prev => [...prev, ...todoIdsToDelete]);

    const deletionPromises = completedTodos.map(async todo => {
      try {
        await removeTodo(todo.id);

        return { id: todo.id, success: true };
      } catch {
        showErrorContainer(ErrorMessage.Delete);

        return { id: todo.id, success: false };
      } finally {
        setTodosDeleting(prev => prev.filter(id => id !== todo.id));
      }
    });

    const results = await Promise.allSettled(deletionPromises);

    const successfullyDeletedIds = results
      .filter(
        result =>
          result.status === 'fulfilled' && result.value.success === true,
      )
      .map(
        result =>
          (result as PromiseFulfilledResult<{ id: number; success: boolean }>)
            .value.id,
      );

    if (successfullyDeletedIds.length > 0) {
      setTodos(prev =>
        prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todosActive={todosActive}
        todosCompleted={todosCompleted}
        titleValue={todoTitleValue}
        handleTitleValueChange={setTodoTitleValue}
        handleAddTodo={handleAddTodo}
        isAddingTodo={isAddingTodo}
        isDeletingTodo={todosDeleting.length > 0}
      />

      <div className="todoapp__content">
        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            todosDeleting={todosDeleting}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
        {tempTodo && <TodoItem todo={tempTodo} isLoading />}

        {todos.length !== 0 && (
          <Footer
            todosActive={todosActive}
            todosCompleted={todosCompleted}
            statusValue={statusValue}
            handleStatusValueChange={setStatusValue}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} hideNotification={() => setError('')} />
    </div>
  );
};
