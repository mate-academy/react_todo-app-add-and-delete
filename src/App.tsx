import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterOption } from './types/filterOption';
import { TodoList } from './components/todoList';
import { InCaseOfError } from './components/inCaseOfError';
import { InputOfTodos } from './components/inputOfTodos';
import { Footer } from './components/footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    // Initialize with some example todos

    {
      id: 1, title: 'Example Todo 1', completed: false, removed: false,
    },

    {
      id: 2, title: 'Example Todo 2', completed: true, removed: false,
    },
  ]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterTodos, setFilterTodos] = useState<FilterOption>('All');
  const [newTodo, setNewTodo] = useState<string>(''); // State for new todo input

  const handleSetFilter = (newFilter: FilterOption) => {
    setFilterTodos(newFilter);
  };

  const closeError = () => {
    setError(null);
  };

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem: Todo = {
        id: todos.length + 1,
        title: newTodo,
        completed: false,
        removed: false,
      };

      setTodos([...todos, newTodoItem]);
      setNewTodo(''); // Clear the input field
    }
  };

  useEffect(() => {
    // You can perform any additional actions here when the todos state changes.
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* Input for adding new todos */}
        <InputOfTodos
          setNewTodo={setNewTodo}
          newTodo={newTodo}
          addTodo={addTodo}
        />

        {/* Pass the filtered todos to TodoList */}
        {todos && (
          <TodoList
            todos={todos}
            filterTodos={filterTodos}
            setTodos={setTodos}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            handleSetFilter={handleSetFilter}
            todos={todos}
            setTodos={setTodos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {error !== null && (
        <InCaseOfError error={error} closeError={closeError} />
      )}
    </div>
  );
};
