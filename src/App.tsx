import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { StatusFilter } from './types/StatusFilter';
import { TodosHeader } from './components/TodosHeader';
import { TodoList } from './components/TodoList';
import { TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterValue, setFilterValue] = useState<StatusFilter>(
    StatusFilter.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsToDel, setTodoIdsToDel] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setTodos(await getTodos());
      } catch (err) {
        setErrorMessage(ErrorMessage.LoadError);
      }
    })();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case StatusFilter.Active:
          return !todo.completed;
        case StatusFilter.Completed:
          return todo.completed;
        case StatusFilter.All:
        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeTodosQuantity = useMemo(
    () => todos.length - completedTodos.length,
    [completedTodos, todos],
  );

  const addNewTodoHandler = async (title: string) => {
    setErrorMessage(null);
    setTempTodo({ title, id: 0, completed: false, userId: USER_ID });
    try {
      const data = await addTodo(title);

      setTodos(prevTodos => [...prevTodos, data]);
    } catch (err) {
      setErrorMessage(ErrorMessage.AddError);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodoHandler = useCallback(async (todoId: number) => {
    setErrorMessage(null);
    setTodoIdsToDel(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(ErrorMessage.DeleteError);
      throw err;
    } finally {
      setTodoIdsToDel(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const clearCompleted = useCallback(() => {
    completedTodos.forEach(todo => {
      return deleteTodoHandler(todo.id);
    });
  }, [completedTodos, deleteTodoHandler]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          addNewTodoHandler={addNewTodoHandler}
          setErrorMessage={setErrorMessage}
          isTempTodo={!!tempTodo}
          todosLength={todos.length}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteTodoHandler={deleteTodoHandler}
              todoIdsToDel={todoIdsToDel}
            />
            <TodosFooter
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              hasCompleted={!!completedTodos.length}
              clearCompleted={clearCompleted}
              activeTodosQuantity={activeTodosQuantity}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
