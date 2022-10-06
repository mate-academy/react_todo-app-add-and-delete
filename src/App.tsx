/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>('');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const userId = user ? user?.id : 0;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId)
      .then(setTodos);
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      return setError('Todo can\'t be empty');
    }

    if (!user) {
      return null;
    }

    setIsAdding(false);

    const newTodoLocal = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId,
    };

    setTodos([...todos, newTodoLocal]);

    try {
      const newTodoFromServer = await addTodo(todoTitle, userId);

      setTodos([...todos, newTodoFromServer]);
      setSelectedTodos(prevIds => [...prevIds, 0]);
    } catch {
      setError('Unable to add a todo');
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== 0));
    } finally {
      setTodoTitle('');
      setIsAdding(false);
    }

    return null;
  };

  const removeTodo = async (todoId: number) => {
    setSelectedTodos(prevTodoIds => [...prevTodoIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currTodos => currTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setSelectedTodos(prevTodoIds => prevTodoIds.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleChange}
              disabled={isAdding}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              title={todoTitle}
              isAdding={isAdding}
              todos={filteredTodos}
              selectedTodos={selectedTodos}
              removeTodo={removeTodo}
            />

            <Footer
              todos={todos}
              filteredTodos={filteredTodos}
              filterType={filterType}
              onFilterChange={setFilterType}
              handleDeleteTodos={removeTodo}
            />
          </>
        )}

      </div>
      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
