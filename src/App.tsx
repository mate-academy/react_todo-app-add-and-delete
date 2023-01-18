import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

import { getTodos, addTodo, deleteTodo } from './api/todos';
import { FilterType } from './types/FilterType';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [isTodoAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [selectedTodosId, setSelectedTodosId] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setErrorMessage('');
      const loadedTodos = await getTodos(user.id);

      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage('Can\'t load todos');
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSubmitForm = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');
      setTitle('');

      return;
    }

    const addNewTodo = async () => {
      setIsAdding(true);

      if (user) {
        try {
          setTempTodo({
            id: 0,
            userId: user?.id,
            title: title.trim(),
            completed: false,
          });

          const loadedTodo = await addTodo({
            userId: user?.id,
            title: title.trim(),
            completed: false,
          });

          setTempTodo(null);

          setTodos(currentTodos => [
            ...currentTodos,
            {
              id: loadedTodo.id,
              userId: user.id,
              title: title.trim(),
              completed: false,
            },
          ]);
        } catch (error) {
          setErrorMessage('Unable to add a todo');
        } finally {
          setTitle('');
          setIsAdding(false);
          setTempTodo(null);
        }
      }
    };

    addNewTodo();
  }, [title]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setIsTodoDeleting(true);
      setSelectedTodosId(todosIds => [
        ...todosIds,
        todoId,
      ]);

      setErrorMessage('');

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      setSelectedTodosId(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsTodoDeleting(false);
    }
  }, []);

  const removeCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.All:
          return todo;

        case FilterType.Active:
          return todo.completed === false;

        case FilterType.Completed:
          return todo.completed === true;

        default:
          throw new Error('Invalid type');
      }
    });
  }, [todos, filterType]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hasCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        newTodoField={newTodoField}
        title={title}
        isTodoAdding={isTodoAdding}
        onInputChange={setTitle}
        onSubmitForm={handleSubmitForm}
      />

      {todos.length > 0 && (
        <>
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            isTodoDeleting={isTodoDeleting}
            selectedTodosId={selectedTodosId}
            onTodoDelete={removeTodo}
          />

          <Footer
            activeTodosAmount={activeTodosAmount}
            hasCompletedTodos={hasCompletedTodos}
            filterType={filterType}
            onChangeType={setFilterType}
            onDeleteCompletedTodos={removeCompletedTodos}
          />
        </>
      )}

      <ErrorNotification
        error={errorMessage}
        onNotificationClose={setErrorMessage}
      />
    </div>
  );
};
