import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import Filter from './components/Filter';
import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';
import { Todo, Error } from './types/Todo';
import { ErrorFile } from './components/ErrorFile';
import { client } from './utils/fetchClient';

const App: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<Error | null>(null);

  const hideError = () => {
    setError(false);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (err) {
        setError(true);
        setErrorType('load');
      }
    };

    fetchTodos();
  }, [todos]);

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo: Todo = await client.post('/todos', {
        userId: 0,
        title,
        completed: false,
      });

      setErrorType('add');
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (err) {
      setError(true);
      setErrorType('add');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await client.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(true);
      setErrorType('delete');
    }
  };

  const handleSetFilter = (selected: 'all' | 'active' | 'completed') => {
    setFilter(selected);
  };

  const handleClearCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const remainingTodoCount = todos.filter(todo => !todo.completed).length;

  const handleEmpty = () => {
    setError(true);
    setErrorType('empty');
    setTimeout(() => {
      hideError();
    }, 3000);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo onAddTodo={handleAddTodo} handleEmpty={handleEmpty} />

        {todos.length > 0 && (
          <TodoList
            todos={todos}
            filter={filter}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {remainingTodoCount}
              {remainingTodoCount === 1 ? ' item' : ' items'} left
            </span>
            {todos.length > 0 && (
              <Filter
                selectedFilter={filter}
                onSelectFilter={handleSetFilter}
              />
            )}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={todos.filter(todo => todo.completed).length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <ErrorFile error={error} errorType={errorType} errorHide={hideError} />
    </div>
  );
};

export default App;
