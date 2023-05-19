/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './enums/FilterBy';
import { getTodos, deleteTodo } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage';
import { USER_ID } from './App.constants';
import { TodoForm } from './components/TodoForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodosNumber = todos
    .filter(todo => todo.completed === false).length;
  const completedTodosNumber = todos.length - activeTodosNumber;
  const areThereCompleted = completedTodosNumber > 0;

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const loadData = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Failed to load data');
    }
  }, []);

  const handleTodoDelete = useCallback(async (todoToDelete: Todo) => {
    try {
      deleteErrorMessage();
      setTempTodo(todoToDelete);
      await deleteTodo(todoToDelete.id);
      loadData();
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.forEach(todo => handleTodoDelete(todo));
  }, [todos]);

  useEffect(() => {
    loadData();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Active:
        return todos.filter(todo => !todo.completed);

      case FilterBy.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: activeTodosNumber > 0,
            })}
          />

          <TodoForm
            onError={setErrorMessage}
            onChange={setTempTodo}
            onCreate={createTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onDelete={handleTodoDelete}
          tempTodo={tempTodo}
        />

        {todos && (
          <Footer
            filter={filterBy}
            onChange={setFilterBy}
            onClear={handleClearCompleted}
            areThereCompleted={areThereCompleted}
            activeTodosNumber={activeTodosNumber}
          />
        )}
      </div>

      <ErrorMessage message={errorMessage} onDelete={deleteErrorMessage} />
    </div>
  );
};
