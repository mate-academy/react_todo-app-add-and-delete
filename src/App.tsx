import React, {
  useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { FilterForTodos } from './components/FilterForTodos';
import { NewTodo } from './components/NewTodo';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';

const emptyTodo: Todo = {
  id: 0,
  title: '',
  userId: 0,
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<TodoStatus>(TodoStatus.ALL);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isTodoAdding, setIstTodoAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>(emptyTodo);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const responseTodos = await getTodos(user.id);

        setTodos(responseTodos);
      }
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to load todos');

      throw new Error(`unexpected error with loading todos: ${error}`);
    } finally {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const loadTodo = async (todoTitle: string) => {
    try {
      if (user) {
        setIstTodoAdding(true);

        setTempTodo({
          id: 0,
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        const newTodo = {
          title: todoTitle,
          userId: user.id,
          completed: false,
        };

        await addTodo(newTodo);

        await loadTodos();
      }
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to add a todo');

      throw new Error(`unexpected error with adding todo: ${error}`);
    } finally {
      setIstTodoAdding(false);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      await loadTodos();
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to delete a todo');

      throw new Error(`unexpected error with deleting todo: ${error}`);
    } finally {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const filterTodos = useCallback((todosFromServer: Todo[]) => {
    return todosFromServer.filter(todo => {
      switch (filterBy) {
        case TodoStatus.ACTIVE:
          return !todo.completed;

        case TodoStatus.COMPLETED:
          return todo.completed;

        default:
          return todosFromServer;
      }
    });
  }, [filterBy]);

  useEffect(() => {
    const filteredTodos = filterTodos(todos);

    setVisibleTodos(filteredTodos);
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          addNewTodo={loadTodo}
          newTodoField={newTodoField}
          isTodoAdding={isTodoAdding}
        />

        {todos.length > 0 && (
          <>
            <TodosList
              removeTodo={removeTodo}
              todos={visibleTodos}
              isTodoAdding={isTodoAdding}
              tempTodo={tempTodo}
            />

            <FilterForTodos
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              todos={todos}
            />
          </>
        )}

      </div>

      {isError && (
        <ErrorMessage
        isError={isError}
        errorText={errorText}
        onClose={() => setIsError(false)}
        />
      )}
    </div>
  );
};
