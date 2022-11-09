/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import {
  addTodoAPI,
  deleteTodoAPI,
  getCompletedTodosAPI,
  getTodosAPI,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { TodosFilter } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasError, setHasError] = useState<Error>({
    message: '',
    status: false,
  });
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.All);
  const [activeTodoIds, setActiveTodoIds] = useState<number []>([]);

  const showError = useCallback((message: string) => {
    setHasError({ status: true, message });

    setTimeout(() => {
      setHasError({ status: false, message: '' });
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodosAPI(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      showError('Unable to load todos');
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    let todosCopy = [...todos];

    if (todoStatus !== TodoStatus.All) {
      todosCopy = todosCopy.filter(todo => {
        switch (todoStatus) {
          case TodoStatus.Active:
            return !todo.completed;

          case TodoStatus.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    setVisibleTodos(todosCopy);
  }, [todoStatus, todos]);

  const handleErrorClose = useCallback(
    () => setHasError({ status: false, message: '' }), [],
  );

  const addNewTodo = async (title: string) => {
    try {
      if (user) {
        const tempData: Todo = {
          id: 0,
          userId: user.id,
          title,
          completed: false,
        };

        setIsAdding(true);
        setTempTodo(tempData as Todo);

        await addTodoAPI(tempData);
        await loadTodos();

        setTempTodo(null);
        setIsAdding(false);
      }
    } catch (err) {
      showError('Unable to add a todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setActiveTodoIds([id]);
      await deleteTodoAPI(id);
      await loadTodos();
      setActiveTodoIds([]);
    } catch (err) {
      showError('Unable to delete a todo');
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      if (user) {
        const completedTodos = await getCompletedTodosAPI(user.id);

        setActiveTodoIds(completedTodos.map(todo => todo.id));

        await Promise.all(completedTodos.map(async ({ id }) => {
          await deleteTodoAPI(id);
        }));

        await loadTodos();
      }
    } catch (err) {
      showError('Unable to delete completed todos');
    }
  };

  const handleStatusSelect = useCallback((status: TodoStatus) => {
    setTodoStatus(status);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          addNewTodo={addNewTodo}
          isAdding={isAdding}
          showError={showError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onDelete={deleteTodo}
              activeTodoIds={activeTodoIds}
            />

            <TodosFilter
              todos={todos}
              todoStatus={todoStatus}
              handleStatusSelect={handleStatusSelect}
              onDelete={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
