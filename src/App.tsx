/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo, TodoStatus, TodoStatusMap } from './types/Todo';
import { TodoList } from './components/TodoList';
import { AddTodo } from './components/AddTodo';
import { ErrorNotification } from './components/ErrorNotification';
import { ToggleAllButton } from './components/ToggleAllButton';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus>(
    TodoStatusMap.All,
  );
  const [addTodoKey, setAddTodoKey] = useState(0);
  const [isDeletingCompletedTodos, setIsDeletingCompletedTodos] =
    useState(false);

  useEffect(() => {
    getTodos()
      .then(todos => setTodoList(todos))
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const todoListActive = todoList.filter(todo => !todo.completed);
  const todoListCompleted = todoList.filter(todo => todo.completed);
  const todoListFiltered =
    filterStatus === TodoStatusMap.All
      ? todoList
      : filterStatus === TodoStatusMap.Active
        ? todoListActive
        : todoListCompleted;

  async function handleAddTodoSubmit(title: string) {
    const temp: Todo = {
      title,
      id: 0,
      userId: 0,
      completed: false,
    };

    setTempTodo(temp);
    setErrorMessage('');

    try {
      const todo: Todo = await addTodo(title);

      setTodoList(prev => [...prev, todo]);
      setTempTodo(null);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);

      throw new Error('Failed to add todo');
    }
  }

  async function handleDeleteTodo(id: Todo['id']) {
    return deleteTodo(id)
      .then(() => {
        setTodoList(prev => prev.filter(todo => todo.id !== id));
        setAddTodoKey(addTodoKey + 1);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'));
  }

  async function handleClearCompleted() {
    setIsDeletingCompletedTodos(true);

    const results = await Promise.allSettled(
      todoListCompleted.map(todo => deleteTodo(todo.id)),
    );

    const deletedIds = todoListCompleted
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    setTodoList(prev => prev.filter(todo => !deletedIds.includes(todo.id)));

    const hasError = results.some(result => result.status === 'rejected');

    if (hasError) {
      setErrorMessage('Unable to delete a todo');
    }

    setAddTodoKey(addTodoKey + 1);
    setIsDeletingCompletedTodos(false);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todoList.length && (
            <ToggleAllButton value={false} onToggle={() => {}} />
          )}
          <AddTodo
            onChange={() => setErrorMessage('')}
            onSubmit={handleAddTodoSubmit}
            onError={setErrorMessage}
            key={addTodoKey}
          />
        </header>
        <TodoList
          todoList={todoListFiltered}
          onDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          isDeletingCompletedTodos={isDeletingCompletedTodos}
        />
        {!!todoList.length && (
          <TodoFooter
            activeCount={todoListActive.length}
            completedCount={todoListCompleted.length}
            status={filterStatus}
            onChangeFilterStatus={setFilterStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
