/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { getTodos, delTodos } from './api/todos';
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
  const [tempTodo, setTempTodo] = useState<string>('');
  const [pending, setPending] = useState<number | null>(null);

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

  //tempTodo readme only title and userId
  const handleAddTodo = async (title: string) => {
    setTempTodo(title);
    console.log(title);
    setPending(-1);
    try {
      const newTodo: Todo = await client.post('/todos', {
        userId: 587,
        title,
        completed: false,
      });

      setErrorType('add');
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (err) {
      setError(true);
      setErrorType('add');
    } finally {
      setPending(null);
      setTempTodo('');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setPending(id);
    try {
      await delTodos(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(true);
      setErrorType('delete');
    } finally {
      setPending(null);
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo onAddTodo={handleAddTodo} />

        {todos.length > 0 && (
          <TodoList
            todos={todos}
            filter={filter}
            onDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            pending={pending}
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
