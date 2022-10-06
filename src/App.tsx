import React, {
  useEffect, useRef, useState, useContext, useCallback, FormEvent, useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTypes } from './types/FilterType';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { TodoList } from './components/TodoList';
import { getTodos, createTodo, deleteTodos } from './api/todos';

export function getFilterTodos(
  todos: Todo[],
  filterTypes: FilterTypes,
) {
  const filterTodo = [...todos];

  switch (filterTypes) {
    case FilterTypes.Active:
      return filterTodo.filter(({ completed }) => !completed);

    case FilterTypes.Completed:
      return filterTodo.filter(({ completed }) => completed);

    default:
      return filterTodo;
  }
}

export const App: React.FC = () => {
  const user = useContext<User | null>(AuthContext);
  // const userId = user?.id ? user.id : 0;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterTypes>(FilterTypes.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [isAdding, setAdding] = useState(false);
  // const [selectedTodoId, setSelectedTodoId] = useState(null);

  useEffect(() => {
    const todoFromServer = async (userId: number) => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(`${error}`);
      } finally {
        setIsLoading(true);
      }
    };

    if (!user) {
      return;
    }

    todoFromServer(user.id);
  }, []);

  const addNewTodo = useCallback(async (event:FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !user) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setAdding(true);

    try {
      const newTodo = await createTodo(user.id, title);

      setTodos(prevTodo => ([...prevTodo, newTodo]));
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsLoading(true);
      setAdding(false);
      setTitle('');
    }
  }, [title, user]);

  const deleteTodo = (todoId: number) => {
    const removedTodo = async () => {
      try {
        await deleteTodos(todoId);

        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setIsLoading(true);
      }
    };

    removedTodo();
  };

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const deleteCompletedTodos = useCallback(() => {
    Promise.all(completedTodos.map(({ id }) => deleteTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  }, [todos, errorMessage]);

  const filteredTodos = useMemo(() => (
    getFilterTodos(todos, filterBy)
  ), [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          addNewTodo={addNewTodo}
          title={title}
          setTitle={setTitle}
        />

        {(isAdding || todos) && (
          <>
            <TodoList
              todos={filteredTodos}
              isLoading={isLoading}
              title={title}
              isAdding={isAdding}
              deleteTodo={deleteTodo}
            />

            <Footer
              getFilterTodo={setFilterBy}
              // filteredTodos={filteredTodos}
              selectedTab={filterBy}
              deleteCompletedTodos={deleteCompletedTodos}
              todos={todos}
            />
          </>

        )}

      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
