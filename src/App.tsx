/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { Footer } from './components/Footer';
import { TodoField } from './components/TodoField';

import { getTodos, newTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.all);
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodo, setDeletedTodo] = useState(0);
  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);
  const [todo, setTodo] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterTypes.active:
        return !todo.completed;

      case FilterTypes.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
      } catch {
        setError('load');
        setTimeout(() => setError(''), 3000);
      }
    };

    loadTodos();
  }, []);

  const addNewTodo = async () => {
    setIsAdding(true);

    if (!todo.length) {
      setError('length');

      return;
    }

    if (user) {
      try {
        const newAPITodo = await newTodo(todo, user.id);

        setTodos(todos => [...todos, newAPITodo]);
      } catch {
        setError('add');
      }
    }

    setTodo('');
    setIsAdding(false);
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedTodo(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(prev => (
        prev.filter(item => item.id !== todoId)
      ));
    } catch {
      setError('delete');
    }
  };

  const handleDeleteAllTodos = async () => {
    try {
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setDeletedTodos(completedTodos);

      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
    } catch {
      setError('deleteAll');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoField
          todos={todos}
          newTodo={newTodoField}
          isAdding={isAdding}
          addNewTodo={() => addNewTodo()}
          setTodo={setTodo}
          todo={todo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
            />
            <Footer
              todos={filteredTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              deleteTodos={handleDeleteAllTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorMessage
          error={error}
          closeError={() => setError('')}
        />
      )}
    </div>
  );
};
