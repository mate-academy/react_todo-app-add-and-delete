import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { addTodo, deleteTodo, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [todoForDeleltingIds, setTodoForDeletingIds] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      setErrorMessage('Something went wrong while loading todos');
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodoOnServer = async () => {
    setIsAdding(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          userId: user?.id,
          title: title.trim(),
          completed: false,
        });

        const newTodo = await addTodo({
          userId: user?.id,
          title: title.trim(),
          completed: false,
        });

        setTitle('');

        setTodos(current => [
          ...current,
          {
            id: newTodo.id,
            userId: newTodo.userId,
            title: newTodo.title,
            completed: newTodo.completed,
          },
        ]);
      } catch (error) {
        // eslint-disable-next-line max-len
        setErrorMessage('Something went wrong while adding a todo. Please, try again later');
      } finally {
        setIsAdding(false);
        setTempTodo(null);
      }
    }
  };

  const handleSubmitForm = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    addTodoOnServer();
  }, [title]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setIsDeleting(true);
      setTodoForDeletingIds(todosIds => [
        ...todosIds,
        todoId,
      ]);

      setErrorMessage('');

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      setTodoForDeletingIds(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      // eslint-disable-next-line max-len
      setErrorMessage('omething went wrong while deleting a todo. Please, try again later');
    } finally {
      setIsDeleting(false);
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
    switch (filterType) {
      case FilterType.All:
        return todos;

      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        throw new Error('Invalid type');
    }
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

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          isAdding={isAdding}
          onInputChange={setTitle}
          onSubmitForm={handleSubmitForm}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isDeleting={isDeleting}
              onTodoDelete={removeTodo}
              todoForDeleltingIds={todoForDeleltingIds}
            />

            <Footer
              activeTodosAmount={activeTodosAmount}
              hasCompletedTodos={hasCompletedTodos}
              filterType={filterType}
              onChangeFilterType={setFilterType}
              onDeleteCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        error={errorMessage}
        handleSetErrorMessage={setErrorMessage}
      />
    </div>
  );
};
