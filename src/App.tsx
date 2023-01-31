import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Filters } from './types/Filters';
import { Todo } from './types/Todo';
import { TodosHeader } from './components/TodosHeader';
import { TodosList } from './components/TodosList';
import { TodosFooter } from './components/TodosFooter';
import { ErrorMessage } from './components/ErrorMessage';
import { getVisibleTodos } from './tools/getVisibleTodos';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { TodosItem } from './components/TodosItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(Filters.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [deletedTodoID, setDeletedTodoID] = useState<number[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage('Unable to load a todos'));
    }
  }, []);

  const addNewTodo = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const newTodoAdding = async () => {
      setIsAdded(true);

      if (user) {
        setTemporaryTodo({
          id: 0,
          userId: user?.id,
          title: newTodoTitle,
          completed: false,
        });

        try {
          const newTodo = await addTodo({
            userId: user.id,
            title: newTodoTitle,
            completed: false,
          });

          setTemporaryTodo(null);

          setTodos(currentTodos => [...currentTodos, newTodo]);

          setNewTodoTitle('');
        } catch (e) {
          setErrorMessage('Unable to add a todo');
        } finally {
          setIsAdded(false);
        }
      }
    };

    newTodoAdding();
  }, [newTodoTitle]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setDeletedTodoID(prev => [...prev, todoId]);
    try {
      await removeTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch (e) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletedTodoID(prev => {
        return prev.filter(deletedID => deletedID !== todoId);
      });
    }
  }, []);

  const deleteAllComplitedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filterOption);
  }, [todos, filterOption]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          newTodoField={newTodoField}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddNewTodo={addNewTodo}
          isAdded={isAdded}
        />

        {(todos.length > 0 || temporaryTodo) && (
          <>
            <TodosList
              todos={visibleTodos}
              onDeleteTodo={deleteTodo}
              deletedTodosID={deletedTodoID}
            />
            {temporaryTodo && (
              <TodosItem todo={temporaryTodo} />
            )}
            <TodosFooter
              activeTodos={activeTodos}
              filterOption={filterOption}
              onChangeFilterType={setFilterOption}
              completedTodos={completedTodos}
              onDeleteCompletedTodos={deleteAllComplitedTodos}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          onChangeErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
