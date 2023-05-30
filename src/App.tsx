import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { addNewTodo, getTodos, removeTodo } from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';

const USER_ID = 10542;

const generateId = (todos: TodoType[]) => {
  const biggestId = Math.max(...todos.map(todo => todo.id));

  return biggestId + 1;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[] | []>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoText, setTodoText] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<string[]>([]);

  const handleLoadTodos = useCallback(async () => {
    try {
      setTodos(await getTodos(USER_ID));
    } catch (error) {
      setErrorMessage('Failed to load todos');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    handleLoadTodos();
  }, []);

  const hasCompletedTodos = todos.filter(todo => todo.completed).length > 0;
  const hasActiveTodos = todos.filter(todo => !todo.completed).length > 0;

  const filterVisibleTodos
    = (filterList: FilterType, todoList: TodoType[]) => {
      const filteredTodos = todoList;

      return filteredTodos.filter(todo => {
        switch (filterList) {
          case FilterType.Completed:
            return todo.completed;
          case FilterType.Active:
            return !todo.completed;
          case FilterType.All:
          default:
            return todo;
        }
      });
    };

  const visibleTodos = useMemo(
    () => filterVisibleTodos(filter, todos),
    [todos, filterVisibleTodos],
  );

  const handleFilterChange = useCallback(
    (newFilter: FilterType) => setFilter(newFilter),
    [],
  );

  const handleCleanErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleTodoTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoText(event.target.value);
    }, [],
  );

  const handleNewTodoSubmit
  = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoText.trim() === '') {
      setErrorMessage('Title can\'t be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTodo = {
      id: generateId(todos),
      userId: USER_ID,
      title: todoText,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoText,
        completed: false,
      });

      await addNewTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);
      setTodoText('');
      setIsInputDisabled(false);
    }
  };

  const handleRemoveTodo = useCallback(async (id: string) => {
    try {
      setLoadingTodoIds(prevIds => [...prevIds, id]);
      await removeTodo(id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id.toString() !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingTodoIds([]);
    }
  }, []);

  const handleRemoveCompleted = useCallback(() => {
    const completedTodosPromises = todos
      .filter(todo => todo.completed)
      .map(todo => handleRemoveTodo(todo.id.toString()));

    Promise.all(completedTodosPromises);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos}
          onTodoTextChange={handleTodoTextChange}
          todoText={todoText}
          onNewTodoSubmit={handleNewTodoSubmit}
          isInputDisabled={isInputDisabled}
        />
        <TodoList
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          onTodoRemove={handleRemoveTodo}
          isLoading={loadingTodoIds}
        />
        <Footer
          filter={filter}
          onFilterChange={handleFilterChange}
          hasCompletedTodos={hasCompletedTodos}
          todosLength={todos.length}
          onRemoveCompleted={handleRemoveCompleted}
        />
      </div>

      {errorMessage
      && (
        <Notification
          onCleanErrorMessage={handleCleanErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
