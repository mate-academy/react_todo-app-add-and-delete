/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
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
import { Todo } from './types/Todo';
import { TodoData } from './types/TodoData';

const USER_ID = 6683;

const filterByStatus = (
  todos: Todo[],
  filter: FilterCases,
) => {
  switch (filter) {
    case FilterCases.Active:
      return todos.filter(({ completed }) => !completed);

    case FilterCases.Completed:
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterCases.All);
  const [error, setError] = useState(ErrorTypes.None);
  const [inputValue, setInputValue] = useState('');
  const [isAddingProceeding, setIsAddingProceeding] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const generateError = (errorType: ErrorTypes) => {
    setError(errorType);

    const timer = setTimeout(() => {
      setError(ErrorTypes.None);
      clearTimeout(timer);
    }, 3000);
  };

  const handleTodoDelete = async (id: number) => {
    try {
      await deleteTodo(id);

      setTodos(current => {
        return current.filter(todo => todo.id !== id);
      });
    } catch {
      generateError(ErrorTypes.DeleteTodoError);
    }
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos
      .filter(({ completed }) => completed);

    completedTodos.forEach(todo => {
      handleTodoDelete(todo.id);
    });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setTodos(await getTodos(USER_ID));
    };

    fetchTodos();
  }, []);

  const handleFilterUpdate = (newFilter: FilterCases) => {
    setFilter(newFilter);
  };

  const handleNotificationClose = () => {
    setError(ErrorTypes.None);
  };

  const handleTodoAdd = (data: TodoData) => {
    const todo = addTodo(data);

    setTempTodo({
      ...data,
      id: 0,
    });

    return todo;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let addedTodo: Todo;
    const newTodoData: TodoData = {
      title: inputValue,
      userId: USER_ID,
      completed: false,
    };

    if (!inputValue) {
      generateError(ErrorTypes.EmptyTitleError);

      return;
    }

    setIsAddingProceeding(true);
    setInputValue('');

    try {
      addedTodo = await handleTodoAdd(newTodoData);

      setTodos(current => [
        ...current,
        addedTodo,
      ]);
    } catch {
      generateError(ErrorTypes.AddTodoError);
    } finally {
      setIsAddingProceeding(false);
      setTempTodo(null);
    }
  };

  const filteredArray = useMemo(() => {
    return filterByStatus(todos, filter);
  }, [filter, todos]);

  const amountOfItemsLeft = todos
    .filter(({ completed }) => !completed).length;

  const isAllTodosActive = amountOfItemsLeft === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length && (
            <ToggleButton isActive={isAllTodosActive} />
          )}

          <form
            onSubmit={handleFormSubmit}
          >
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
            handleTodoDelete={handleTodoDelete}
          />
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isAddingProceeding={isAddingProceeding}
              onDelete={handleTodoDelete}
            />
          )}
        </section>

        {todos.length && (
          <Footer
            handleClearAll={clearCompletedTodos}
            amountOfItemsLeft={amountOfItemsLeft}
            amountOfItems={todos.length}
            currentFilter={filter}
            handleLinkClick={handleFilterUpdate}
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
