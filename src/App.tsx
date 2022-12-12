import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { addTodo, getTodos, removeTodo } from './api/todos';

import { Header } from './components/Header/Header';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from
  './components/ErrorNotifications/ErrorNotifications';
import { Footer } from './components/Footer/Footer';

import { Todo } from './types/Todo';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentError, setCurrentError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([0]);

  const user = useContext(AuthContext);

  const loadUserTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (error) {
        setHasError(true);
        setCurrentError('Unable to load user todos');
      }
    }
  }, []);

  useEffect(() => {
    loadUserTodos();
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const addNewTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    try {
      setIsAdding(true);

      const todo = await addTodo(todoData);

      setTitle('');

      setTodos(prevTodos => [...prevTodos, todo]);

      setIsAdding(false);
    } catch (error) {
      setHasError(true);
      setCurrentError('Unable to add a todo');
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setSelectedTodoIds([...selectedTodoIds, todoId]);

      await removeTodo(todoId);

      setSelectedTodoIds([0]);
    } catch (error) {
      setHasError(true);
      setCurrentError('Unable to delete a todo');
    }

    await loadUserTodos();
  }, []);

  const clearCompleted = useCallback(async () => {
    try {
      setSelectedTodoIds(currentIds => (
        [...currentIds, ...completedTodos.map(todo => todo.id)]
      ));

      await Promise.all(completedTodos.map(async (todo) => {
        await removeTodo(todo.id);
      }));

      await loadUserTodos();
    } catch (error) {
      setHasError(true);
      setCurrentError('Unable to clear the completed tasks');
    }
  }, [completedTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos}
          user={user}
          title={title}
          setTitle={setTitle}
          setCurrentError={setCurrentError}
          setHasError={setHasError}
          onSubmit={addNewTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              status={status}
              newTodoTitle={title}
              isAdding={isAdding}
              onDelete={deleteTodo}
              ids={selectedTodoIds}
            />

            <Footer
              activeTodos={activeTodos}
              status={status}
              setStatus={setStatus}
              completedTodos={completedTodos}
              onDelete={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        setCurrentError={setCurrentError}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
