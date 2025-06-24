import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import * as todoService from './services/post.service';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoFilter } from './types/TodoFilter';
import { USER_ID } from './api/todos';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = todos.filter(todo => {
    if (filter === TodoFilter.Active) {
      return !todo.completed;
    }

    if (filter === TodoFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  function loadTodos() {
    setErrorMessage('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  async function addTodo(title: string) {
    const newTempTodo = {
      userId: USER_ID,
      id: 0,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingTodoId(0);

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
      throw new Error('Empty title');
    }

    try {
      const createdTodo = await todoService.addTodo(title.trim());
      const newTodo = createdTodo as Todo;

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => setErrorMessage(''), 3000);
      throw new Error('Failed to add todo');
    } finally {
      setLoadingTodoId(null);
      setTempTodo(null);
    }
  }

  function deleteTodo(todoId: number) {
    setLoadingTodoId(todoId);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  }

  async function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const successfulIds: number[] = [];

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulIds.push(completedTodos[index].id);
      } else {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    });

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfulIds.includes(todo.id)),
    );
  }

  useEffect(loadTodos, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} addTodo={addTodo} />

        <TodoList
          todos={visibleTodos}
          onDelete={deleteTodo}
          loadingTodoId={loadingTodoId}
        />

        {tempTodo && (
          <TodoItem
            {...tempTodo}
            loadingTodoId={loadingTodoId}
            onDelete={deleteTodo}
          />
        )}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
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
