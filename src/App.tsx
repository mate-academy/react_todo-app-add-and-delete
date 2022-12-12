/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterValues } from './types/FilterValues';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterValues>(FilterValues.ALL);
  const [isProcessing, setIsProcessing] = useState<number[]>([]);
  const user = useContext(AuthContext);
  const activeTodosCount = todos.filter(todoItem => !todoItem.completed).length;
  const completedTodosId = todos.filter(todoItem => todoItem.completed)
    .map(todo => todo.id);
  const allCompleted = todos.every(todoItem => todoItem.completed);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await getTodos(user.id);

      setTodos(response);
    } catch {
      setErrorMessage('Unable to load todos');
    }

    setIsLoaded(true);
  };

  const onAdd = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const onDelete = async (todoId: number) => {
    setIsProcessing(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsProcessing([]);
    }
  };

  const onDeleteCompleted = async () => {
    setIsProcessing(prev => [...prev, ...completedTodosId]);

    const fetchArr = completedTodosId.map(id => (
      deleteTodo(id)
    ));

    try {
      await Promise.all(fetchArr);
      setTodos(prev => (
        prev.filter(todoItem => !completedTodosId.includes(todoItem.id))
      ));
    } catch {
      setErrorMessage('Unable to delete completed todos');
    } finally {
      setIsProcessing([]);
    }
  };

  const onRename = async (todoId: number, title: string) => {
    setIsProcessing(prev => [...prev, todoId]);

    try {
      const response = await updateTodo(todoId, { title });

      const todo = todos.find(todoItem => todoItem.id === todoId);

      if (todo) {
        todo.title = response.title;
      }
    } catch {
      setErrorMessage('Unable to change the title');
    } finally {
      setIsProcessing([]);
    }
  };

  const onComplete = async (todo: Todo) => {
    setIsProcessing(prev => [...prev, todo.id]);

    try {
      const response
        = await updateTodo(todo.id, { completed: !todo.completed });

      const todoToUpdate = todos.find(todoItem => todoItem.id === todo.id);

      if (todoToUpdate) {
        todoToUpdate.completed = response.completed;
      }

      setTodos([...todos]);
    } catch {
      setErrorMessage('Unable to updata todo');
    } finally {
      setIsProcessing([]);
    }
  };

  const onCompleteAll = async () => {
    const processingTodosId = todos.map(todoItem => todoItem.id);

    setIsProcessing(processingTodosId);

    try {
      const fetchArr = todos.map(todoItem => (
        updateTodo(todoItem.id, { completed: !allCompleted })
      ));

      await Promise.all(fetchArr);

      setTodos(prev => prev.map(todoItem => ({
        ...todoItem,
        completed: !allCompleted,
      })));
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      setIsProcessing([]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filter) {
        case FilterValues.ACTIVE:
          return todo.completed === false;
        case FilterValues.COMPLETED:
          return todo.completed === true;
        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          setError={setErrorMessage}
          user={user}
          onAdd={onAdd}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          setNewTodoTitle={setNewTodoTitle}
          allCompleted={allCompleted}
          onCompleteAll={onCompleteAll}
        />

        <TodoList
          visibleTodos={visibleTodos}
          isAdding={isAdding}
          newTodoTitle={newTodoTitle}
          onDelete={onDelete}
          onRename={onRename}
          isProcessing={isProcessing}
          onComplete={onComplete}
        />

        {(isLoaded && todos.length > 0) && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            onDeleteCompleted={onDeleteCompleted}
            completedTodosCount={completedTodosId.length}
          />
        )}
      </div>

      {errorMessage && (
        <Error
          error={errorMessage}
          setError={setErrorMessage}
        />
      )}
    </div>
  );
};
