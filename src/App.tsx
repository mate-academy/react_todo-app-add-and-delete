import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
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
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number []>([]);

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

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
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
            title,
            completed: false,
          });

          const loadedTodo = await addTodo({
            userId: user?.id,
            title,
            completed: false,
          });

          setTempTodo(null);

          setTodos(currentTodos => [
            ...currentTodos,
            {
              id: loadedTodo.id,
              userId: user.id,
              title,
              completed: false,
            },
          ]);
        } catch (error) {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        } finally {
          setTitle('');
          setIsAdding(false);
          setTempTodo(null);
        }
      }
    };

    addNewTodo();
  };

  const filterTodos = () => {
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
  };

  const removeTodo = async (todoId: number) => {
    try {
      setIsTodoDeleting(true);
      setSelectedTodoId(todosIds => [
        ...todosIds,
        todoId,
      ]);

      setErrorMessage('');

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      setSelectedTodoId(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsTodoDeleting(false);
    }
  };

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  const filteredTodos = filterTodos();
  const activeTodos = todos.filter(todo => todo.completed === false).length;
  const hasCompletedTodos = todos.some(todo => todo.completed === true);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        newTodoField={newTodoField}
        title={title}
        isAdding={isAdding}
        onChange={setTitle}
        onSubmitForm={handleSubmitForm}
      />

      {todos.length > 0 && (
        <>
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            isTodoDeleting={isTodoDeleting}
            selectedTodoId={selectedTodoId}
            onDelete={removeTodo}
          />

          <Footer
            activeTodos={activeTodos}
            hasCompletedTodos={hasCompletedTodos}
            filterType={filterType}
            onChangeType={setFilterType}
            onDelete={removeCompletedTodos}
          />
        </>
      )}

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onClick={setErrorMessage}
        />
      )}
    </div>
  );
};
