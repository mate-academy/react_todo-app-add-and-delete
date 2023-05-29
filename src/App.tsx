import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { addNewTodo, getTodos, removeTodo } from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

const USER_ID = 10542;

const generateId = (todos: TodoType[]) => {
  const biggestId = Math.max(...todos.map(todo => todo.id));

  return biggestId + 1;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[] | []>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [todoText, setTodoText] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<string[]>([]);

  const loadTodos = useCallback(async () => {
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
    loadTodos();
  }, []);

  const hasCompleted = todos.filter(todo => todo.completed).length > 0;
  const hasActive = todos.filter(todo => !todo.completed).length > 0;

  const visibleTodos = useMemo(() => {
    let filteredTodos = todos;

    switch (filter) {
      case 'completed':
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      case 'active':
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case 'all':
        filteredTodos = todos;
        break;
      default:
        break;
    }

    return filteredTodos;
  }, [filter, todos]);

  const filterAll = useCallback(() => {
    setFilter('all');
  }, []);

  const filterCompleted = useCallback(() => {
    setFilter('completed');
  }, []);

  const filterActive = useCallback(() => {
    setFilter('active');
  }, []);

  const handleCleanErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleTextChange = useCallback(
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
      await addNewTodo(newTodo);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoText,
        completed: false,
      });

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
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach(todoId => handleRemoveTodo(todoId.toString()));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActive={hasActive}
          handleChangeTodoText={handleTextChange}
          todoText={todoText}
          handleNewTodoSubmit={handleNewTodoSubmit}
          handleDisableInput={isInputDisabled}
        />
        <TodoList
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          handleRemoveTodo={handleRemoveTodo}
          isLoading={loadingTodoIds}
        />
        <Footer
          filter={filter}
          filterAll={filterAll}
          filterActive={filterActive}
          filterCompleted={filterCompleted}
          hasCompleted={hasCompleted}
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
