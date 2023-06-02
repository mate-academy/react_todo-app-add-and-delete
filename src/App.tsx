import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import {
  TodoNotification,
} from './components/TodoNotification/TodoNotification';

const USER_ID = 10594;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingTodos, setRemainingTodos] = useState(0);
  const [areAllTodosCompleted, setAreAllTodosCompleted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const handleCompletedTodosChange = async (isChecked: boolean, id: number) => {
    setUpdatingIds([...updatingIds, id]);

    try {
      await updateTodo(id, isChecked);

      setTodos(todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: isChecked };
        }

        return todo;
      }));

      if (isChecked) {
        setRemainingTodos(remainingTodos - 1);
      } else {
        setRemainingTodos(remainingTodos + 1);
      }
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleToggleAllTodos = async () => {
    const todoIds = todos.map(todo => todo.id);

    setUpdatingIds([...updatingIds, ...todoIds]);

    try {
      await Promise.all(todos.map(
        todo => updateTodo(todo.id, !areAllTodosCompleted),
      ));

      const newTodos = todos.map(todo => (
        { ...todo, completed: !areAllTodosCompleted }
      ));

      setTodos(newTodos);
      setAreAllTodosCompleted(!areAllTodosCompleted);
      setRemainingTodos(newTodos.filter(todo => !todo.completed).length);
    } catch (error) {
      setErrorMessage('Unable to update todos');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const todoIds = completedTodos.map(todo => todo.id);

    setUpdatingIds([...updatingIds, ...todoIds]);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(todos.filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage('Unable to delete a completed todos');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleAddTodo = async (title: string) => {
    if (title.trim().length === 0) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsCreatingTodo(true);

    try {
      const newTodo: Todo = await createTodo(title, USER_ID);

      setTodos([...todos, newTodo]);
      setRemainingTodos(remainingTodos + 1);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsCreatingTodo(false);
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (id: number, completed: boolean) => {
    setUpdatingIds([...updatingIds, id]);

    try {
      await deleteTodo(id);

      setTodos(todos.filter(todo => todo.id !== id));
      if (!completed) {
        setRemainingTodos(remainingTodos - 1);
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleDismissNotification = () => {
    setErrorMessage('');
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
        setRemainingTodos(loadedTodos.filter(todo => !todo.completed).length);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader
          onToggleAll={handleToggleAllTodos}
          active={areAllTodosCompleted}
          onAddTodo={handleAddTodo}
          isCreatingTodo={isCreatingTodo}
        />

        <TodoList
          todos={filteredTodos}
          onChange={handleCompletedTodosChange}
          onRemove={handleRemoveTodo}
          tempTodo={tempTodo}
          updatingIds={updatingIds}
        />

        <TodoFooter
          remainingTodos={remainingTodos}
          filter={filter}
          setFilter={setFilter}
          hasCompletedTodos={todos.some(todo => todo.completed)}
          onClearCompleted={handleClearCompleted}
        />

        {errorMessage && (
          <TodoNotification
            message={errorMessage}
            onDismiss={handleDismissNotification}
          />
        )}

      </div>
    </div>
  );
};
