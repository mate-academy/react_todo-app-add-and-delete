/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
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

  const loadTodos = async () => {
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
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSubmitForm = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');

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

          const addedTodo = await addTodo({
            userId: user?.id,
            title: title.trim(),
            completed: false,
          });

          setTitle('');

          setTodos(currentTodos => [
            ...currentTodos,
            addedTodo,
          ]);
        } catch (error) {
          setErrorMessage('Unable to add a todo');
        } finally {
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
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => (
          !todo.completed
        ));

      case FilterStatus.Completed:
        return todos.filter(todo => (
          todo.completed));

      default:
        return todos;
    }
  }, [filterStatus, todos]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          isTodoAdding={isTodoAdding}
          handleChangeInput={setTitle}
          handleSubmitForm={handleSubmitForm}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isTodoDeleting={isTodoDeleting}
              selectedTodosId={selectedTodosId}
              removeTodo={removeTodo}
            />

            <Footer
              activeTodosAmount={activeTodosAmount}
              isCompletedTodos={isCompletedTodos}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
