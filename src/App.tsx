import React,
{
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import {
  addTodos,
  getTodos,
  deleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/Todolist';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { TodosLength } from './TodosLength';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterType, setFilterType] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const clearTitle = () => {
    setTitle('');
  };

  const handleDeleteItem = useCallback(
    async (todoId: number) => {
      deleteTodo(todoId)
        .then(() => (
          setTodos(currentTodos => currentTodos
            .filter(todo => todo.id !== todoId))
        ))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    }, [title],
  );

  const handleAddTodo = useCallback(
    async () => {
      if (title) {
        const todo = await addTodos(title, user?.id, false);

        setTodos(prev => [...prev, todo]);

        clearTitle();
      }

      if (!title) {
        setErrorMessage('Title can\'t be empty');
      }
    }, [title],
  );

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterType === Filter.ACTIVE) {
        return !todo.completed;
      }

      if (filterType === Filter.COMPLITED) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterType]);

  const handleFilterType = useCallback((value: Filter) => {
    setFilterType(value);
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(result => {
          setTodos(result);
        })
        .catch(() => {
          setErrorMessage('Todos not found');
        })
        .finally(() => {
        });
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          setTitle={setTitle}
          onAddTodo={handleAddTodo}
        />

        {visibleTodos && (
          <TodoList
            todos={visibleTodos}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {!!todos.length && (
          <TodosLength.Provider value={todos.length}>
            <Footer onSelectFilter={handleFilterType} />
          </TodosLength.Provider>
        )}
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};
