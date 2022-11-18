import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  addTodo, deleteTodo, getCompletedTodos, getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { NewTodo } from './components/TodoComponents/NewTodo';
import { TodoList } from './components/TodoComponents/TodoList';
import { ErorTypes } from './types/ErrorTypes';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [isErrorMessage, setIsErrorMessage]
    = useState<ErorTypes>(ErorTypes.none);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        setVisibleTodos(todosFromServer);
      }
    } catch {
      setIsErrorMessage(ErorTypes.load);
    }
  }, []);

  const addNewTodo = async (title: string) => {
    try {
      if (user) {
        const tempData = {
          id: 0,
          userId: user.id,
          title,
          completed: false,
        };
        const addedTodo = await addTodo(tempData);

        if (!addedTodo) {
          setTempTodo(null);
        }

        setIsAdding(true);
        setTempTodo(tempData as Todo);
        setActiveTodoIds([0]);

        await loadTodos();

        setTempTodo(null);
        setIsAdding(false);
        setActiveTodoIds([]);
      }
    } catch {
      setIsErrorMessage(ErorTypes.upload);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setActiveTodoIds([id]);
      await deleteTodo(id);
      await loadTodos();
      setActiveTodoIds([]);
    } catch {
      setIsErrorMessage(ErorTypes.delete);
    }
  };

  const removeCompletedTodos = async () => {
    try {
      if (user) {
        const completedTodos = await getCompletedTodos(user.id);

        setActiveTodoIds(completedTodos.map(todo => todo.id));

        await Promise.all(completedTodos.map(async ({ id }) => {
          await deleteTodo(id);
        }));

        await loadTodos();
        setActiveTodoIds([]);
      }
    } catch {
      setIsErrorMessage(ErorTypes.delete);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="ToggleAllButton"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodo
            addNewTodo={addNewTodo}
            isAdding={isAdding}
            setIsErrorMessage={setIsErrorMessage}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onRemove={removeTodo}
              activeTodoIds={activeTodoIds}
            />

            <Footer
              todos={todos}
              visibleTodos={visibleTodos}
              setVisibleTodos={setVisibleTodos}
              onRemoveCompleted={removeCompletedTodos}
            />
          </>
        )}

      </div>

      <ErrorNotification
        isErrorMessage={isErrorMessage}
        setIsErrorMessage={setIsErrorMessage}
      />
    </div>
  );
};
