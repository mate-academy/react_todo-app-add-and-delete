import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { FilterMethods } from './types/FilterMethods';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterMethod, setFilterMethod]
  = useState<FilterMethods>(FilterMethods.ALL);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const getTodosFromsServer = async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch (Error) {
      setErrorMessage('Loading error!');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  useEffect(() => {
    getTodosFromsServer();
  }, [todos]);

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterMethod) {
      case FilterMethods.COMPLETED:
        return completed;

      case FilterMethods.ACTIVE:
        return !completed;

      default:
        return true;
    }
  });

  const addNewTodo = async (newTitle: string) => {
    if (!user) {
      return;
    }

    try {
      setIsAdding(true);

      const todoToAdd = {
        title: newTitle,
        userId: user.id,
        completed: false,
      };

      const newTodo = await addTodo(todoToAdd);

      setIsAdding(false);
      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTitle('');
      setIsAdding(false);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const todosLeft = todos.filter((todo) => (
    !todo.completed
  )).length;

  const completedTodos = todos.filter((todo) => (
    todo.completed
  ));

  const removeCompletedTodos = async () => {
    setIsAdding(true);

    try {
      await Promise.all(completedTodos.map(async (todo) => {
        await removeTodo(todo.id);
      }));
      getTodosFromsServer();
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todos={filteredTodos}
          title={title}
          setTitle={setTitle}
          addNewTodo={addNewTodo}
          isAdding={isAdding}
          setErrorMessage={setErrorMessage}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              isAdding={isAdding}
              title={title}
              setErrorMessage={setErrorMessage}
            />

            <Footer
              filterMethod={filterMethod}
              setFilterMethod={setFilterMethod}
              todosLeft={todosLeft}
              completedTodos={completedTodos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Errors
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
