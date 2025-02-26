/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newTodo, setNewTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newFilter, setNewFilter] = useState<Filter>(Filter.All);
  const [isActive] = useState<number>();
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const [isLoading, setIsLoading] = useState(false);
  const [todoClear, setTodoClear] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const isTodoClear = todos.some(todo => todo.completed);

  const loadTodos = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const todosData = await getTodos();
      const completedTodos = todosData.filter(todo => todo.completed);

      setTodos(todosData);
      setTodoClear(completedTodos.length > 0);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTodoClear(isTodoClear);
  }, [isTodoClear]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const deleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);
    deleteTodos(todoId)
      .then(() => {
        setIsLoading(true);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setDeletingTodoId(null);
      });
  };

  const clearCompletedTodos = async () => {
    setIsLoading(true);

    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const failedTodos: Todo[] = [];

      for (const todo of completedTodos) {
        try {
          await deleteTodos(todo.id);
        } catch (error) {
          setErrorMessage('Unable to delete a todo');
          failedTodos.push(todo);
        }
      }

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !todo.completed || failedTodos.includes(todo),
        ),
      );

      if (failedTodos.length > 0) {
        setTodos(prevTodos => [...prevTodos, ...failedTodos]);
      }

      setTodoClear(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsInputDisabled(false);
      setIsLoading(false);
    }
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);
    setIsInputDisabled(true);

    const tempNewTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    setTempTodo(tempNewTodo);

    try {
      const addedTodo = await addTodos(tempNewTodo);
      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setNewTodo('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      setIsInputDisabled(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (newFilter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        isInputDisabled={isInputDisabled}
        handleSubmit={onAdd}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        todos={todos}
      />

      {todos.length > 0 && (
        <TodoList
          deletingTodoId={deletingTodoId}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          filteredTodos={filteredTodos}
          isActive={isActive}
          isLoading={isLoading}
        />
      )}

      {todos.length > 0 && (
        <Footer
          todoClear={todoClear}
          newFilter={newFilter}
          setNewFilter={setNewFilter}
          todosLeft={todosLeft}
          clearCompletedTodos={clearCompletedTodos}
        />
      )}
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
