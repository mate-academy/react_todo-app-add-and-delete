/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { ToggleButton } from './components/ToggleButton';
import { ErrorTypes } from './types/ErrorTypes';
import { FilterCases } from './types/FilterCases';
import { Todo, TodoToSend } from './types/Todo';
import { filterByStatus, generateError } from './utils/helper';

const USER_ID = 6683;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterCases.All);
  const [error, setError] = useState(ErrorTypes.None);
  const [inputValue, setInputValue] = useState('');
  const [isAddingProceeding, setIsAddingProceeding] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const fetchTodos = async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
  };

  const handleTodoDelete = async (id: number) => {
    try {
      await deleteTodo(id);

      setTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      generateError(ErrorTypes.DeleteTodoError, setError);
    }
  };

  const clearCompletedTodos = () => {
    const arrayOfPromises:Promise<void>[] = [];
    const completedTodos = todos
      .filter(({ completed }) => completed);

    completedTodos.forEach(todo => {
      arrayOfPromises.push(handleTodoDelete(todo.id));
    });
    Promise.all(arrayOfPromises);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFilterUpdate = useCallback((newFilter: FilterCases) => {
    setFilterType(newFilter);
  }, []);

  const handleNotificationClose = useCallback(() => {
    setError(ErrorTypes.None);
  }, []);

  const handleTodoAdd = useCallback((data: TodoToSend) => {
    const todo = addTodo(data);

    setTempTodo({
      ...data,
      id: 0,
    });

    return todo;
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      generateError(ErrorTypes.EmptyTitleError, setError);
      setInputValue('');

      return;
    }

    const newTodoData: TodoToSend = {
      title: inputValue,
      userId: USER_ID,
      completed: false,
    };

    setIsAddingProceeding(true);
    setInputValue('');

    try {
      const addedTodo = await handleTodoAdd(newTodoData);

      setTodos(current => [
        ...current,
        addedTodo,
      ]);
    } catch {
      generateError(ErrorTypes.AddTodoError, setError);
    } finally {
      setIsAddingProceeding(false);
      setTempTodo(null);
    }
  };

  const filteredArray = useMemo(() => {
    return filterByStatus(todos, filterType);
  }, [filterType, todos]);

  const amountOfItemsLeft = todos.filter(({ completed }) => !completed).length;

  const isAllTodosActive = amountOfItemsLeft === 0;

  const isTodosEmpty = todos.length === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isTodosEmpty && (
            <ToggleButton isActive={isAllTodosActive} />
          )}

          <form onSubmit={handleFormSubmit}>
            <input
              disabled={isAddingProceeding}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main">
          <TodoList
            todos={filteredArray}
            onDelete={handleTodoDelete}
          />

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isAddingProceeding={isAddingProceeding}
              onDelete={handleTodoDelete}
            />
          )}
        </section>

        {!isTodosEmpty && (
          <Footer
            onClear={clearCompletedTodos}
            amountOfItemsLeft={amountOfItemsLeft}
            amountOfItems={todos.length}
            currentFilter={filterType}
            onFilterChange={handleFilterUpdate}
          />
        )}
      </div>

      <Notification
        message={error}
        onButtonClick={handleNotificationClose}
      />
    </div>
  );
};
