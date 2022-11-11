/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { getTodos, addNewTodo, deleteTodo } from './api/todos';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/Auth/ErrorNotification';
import { TodoList } from './components/Auth/TodoList';
import { Footer } from './components/Auth/Footer';
import { Header } from './components/Auth/Header';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todosAreLoaded, setTodosAreLoaded] = useState(false);
  const [error, setError] = useState<Error>(Error.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [todosIdsForDelete, setTodosIdsForDelete] = useState<number[]>([]);

  const userId = user ? user.id : 1;

  const resetError = () => {
    setTimeout(() => {
      setError(Error.NONE);
    }, 3000);
  };

  const loadTodosFromServer = useCallback(async () => {
    try {
      const todosFromApi = await getTodos(userId);

      setVisibleTodos(todosFromApi);
      setTodosAreLoaded(true);
    } catch (err) {
      setError(Error.UPDATE);
      resetError();
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const addNewTodoToServer = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      if (!newTodoTitle.trim()) {
        setError(Error.EMPTY);
        resetError();

        return;
      }

      const newTodo = {
        title: newTodoTitle,
        userId,
        completed: false,
      };

      setTempTodo({ id: 0, ...newTodo });

      await addNewTodo(newTodo);
      setIsAdding(true);
      await loadTodosFromServer();
      setNewTodoTitle('');
      setIsAdding(false);
    } catch (err) {
      setError(Error.ADD);
      resetError();
    }
  };

  const deleteTodoFromServer = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodosIdsForDelete((currentIds) => [...currentIds, todoId]);
      await loadTodosFromServer();
    } catch (err) {
      setError(Error.DELETE);
      resetError();
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);

    await completedTodos.forEach(todo => {
      deleteTodoFromServer(todo.id);
    });
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodosFromServer();
  }, []);

  const filteredTodos = visibleTodos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <Header
          todosAreLoaded={todosAreLoaded}
          addNewTodo={addNewTodoToServer}
          newTodoField={newTodoField}
          newTodoTitle={newTodoTitle}
          handleTitleChange={handleTitleChange}
          isAdding={isAdding}
          todos={visibleTodos}
        />
        {todosAreLoaded && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              deleteTodo={deleteTodoFromServer}
              todosIdsForDelete={todosIdsForDelete}
            />
            <Footer
              filter={filter}
              setFilter={setFilter}
              todos={visibleTodos}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
