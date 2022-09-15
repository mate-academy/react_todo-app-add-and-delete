import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addNewTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Errors } from './components/Errors/Errors';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterOption } from './types/FilterOption';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filterOption, setFilterOption]
    = useState<FilterOption>(FilterOption.all);
  const [todoAction, setTodoAction] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTodoName, setNewTodoName] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const loadedTodos = await getTodos(user.id);

          setTodos(loadedTodos);
        }
      } catch {
        setError('load');
      }
    };

    loadData();

    // focus the element with `ref={newTodoField}`

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const closeError = () => {
    setError('');
  };

  const loadInfo = async () => {
    if (user) {
      const loadTodos = await getTodos(user.id);

      setIsAdding(false);
      setTodos(loadTodos);
      setTodoAction([]);
    }
  };

  const addTodo = async (todoTitle: string) => {
    if (!user) {
      return null;
    }

    if (!todoTitle) {
      return setError('empty');
    }

    setNewTodoName(todoTitle);
    setIsAdding(true);
    const numbers: Todo[] = await getTodos(user.id);
    let id;

    if (numbers.length === 0) {
      id = user.id;
    } else {
      id = numbers[numbers.length - 1].id + 1;
    }

    closeError();
    try {
      const newTodo: Todo = {
        id,
        userId: user.id,
        completed: false,
        title: todoTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const addToList = await addNewTodo(newTodo);

      loadInfo();

      return addToList;
    } catch {
      setTodoAction([]);
      setIsAdding(false);

      return setError('add');
    }
  };

  const removeTodo = async (todoId: number) => {
    closeError();
    try {
      const deleteTodos = await deleteTodo(todoId);

      loadInfo();

      return deleteTodos;
    } catch {
      setTodoAction([]);

      return setError('delete');
    }
  };

  const removeOneTodo = (todoId: number) => {
    setTodoAction([todoId]);
    removeTodo(todoId);
  };

  const deleteCompleted = () => {
    const fewTodosAction
      = todos.filter(todo => todo.completed).map(todo => todo.id);

    setTodoAction(fewTodosAction);

    const deleteCompleteTodos
      = todos.filter(todo => todo.completed).forEach(todo => {
        removeTodo(todo.id);
      });

    return deleteCompleteTodos;
  };

  const filterTodos = () => {
    closeError();
    switch (filterOption) {
      case FilterOption.active:
        return todos.filter(todo => !todo.completed);

      case FilterOption.completed:
        return todos.filter(todo => todo.completed);

      case FilterOption.all:
        return todos;

      default:
        return todos;
    }
  };

  const filteredTodos = useMemo(filterTodos, [todos, filterOption]);

  if (error) {
    setTimeout(closeError, 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todos={todos}
          toNameTodo={addTodo}
          isAdding={isAdding}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeOneTodo}
          todoAction={todoAction}
          isAdding={isAdding}
          newTodoName={newTodoName}
          user={user}
        />

        <Footer
          todos={todos}
          deleteCompleted={deleteCompleted}
          filterTodos={event => setFilterOption(event)}
          filterOption={filterOption}
          isAdding={isAdding}
        />
      </div>

      <Errors
        error={error}
        closeError={closeError}
      />
    </div>
  );
};
