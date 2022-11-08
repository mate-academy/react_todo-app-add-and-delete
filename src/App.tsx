import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { SortType } from './types/SortType';
import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState(SortType.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderCompletedTodo, setIsLoaderCompletedTodo] = useState(false);

  const completedTodosIds = [...todos].filter(todo => todo.completed)
    .map(todo => todo.id);

  const unCompletedTodosIds = [...todos].filter(todo => !todo.completed)
    .map(todo => todo.id);

  const getFilteredTodos = () => {
    let filteredTodos = [...todos];

    switch (sortType) {
      case SortType.ACTIVE:
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case SortType.COMPLETED:
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;

      default:
    }

    return filteredTodos;
  };

  const handlerSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle) {
      setError('Title can\'t be empty');
    } else {
      setIsAdding(true);
      setTitle(newTodoTitle);
      createTodo(newTodoTitle, (user as User).id, false)
        .then(() => {
          getTodos((user as User).id)
            .then(todoFromServer => setTodos(todoFromServer));
        })
        .catch(() => setError('Unable to add a todo'))
        .finally(() => setIsAdding(false));
      setNewTodoTitle('');
    }
  };

  const handlerTodoDeleteButton = (id: number) => {
    setSelectedTodoId(id);
    setIsLoader(true);
    deleteTodo(id)
      .then(() => {
        getTodos((user as User).id)
          .then(todoFromServer => setTodos(todoFromServer));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsLoader(false));
  };

  const handlerClearCompletedButton = () => {
    setIsLoaderCompletedTodo(true);
    completedTodosIds.map(todo => {
      return (
        deleteTodo(todo)
          .then(() => {
            getTodos((user as User).id)
              .then(todoFromServer => setTodos(todoFromServer));
          })
          .catch(() => setError('Unable to delete a todo'))
          .finally(() => setIsLoaderCompletedTodo(false))
      );
    });
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(todoFromServer => setTodos(todoFromServer))
        .catch(() => setError('Unable to loading a todos'));
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAdding={isAdding}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handlerSubmitForm={handlerSubmitForm}
        />

        {todos.length > 0 && (
          <TodoList
            todos={getFilteredTodos()}
            isAdding={isAdding}
            userId={user?.id || 0}
            title={title}
            isLoader={isLoader}
            selectedTodoId={selectedTodoId}
            completedTodosIds={completedTodosIds}
            handlerTodoDeleteButton={handlerTodoDeleteButton}
            isLoaderCompletedTodo={isLoaderCompletedTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            setSortType={setSortType}
            completedTodosIds={completedTodosIds}
            sortType={sortType}
            handlerClearCompletedButton={handlerClearCompletedButton}
            unCompletedTodosIds={unCompletedTodosIds}
          />
        )}
      </div>

      <TodoErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
