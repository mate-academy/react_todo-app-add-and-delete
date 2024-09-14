import React, { useEffect, useState } from 'react';
import { addTodos, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TodoStatus } from './types/TodoStatus';
import { ErrorField } from './components/ErrorField/ErrorField';
import { Footer } from './components/Footer/Footer';
import { getFiltredTodos } from './utils/getFiltredTodos';
import { ErrorMessage } from './types/ErrorMessage';

const todoProperties = {
  userId: USER_ID,
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [activeFilter, setActiveFilter] = useState<TodoStatus>(TodoStatus.All);
  const [isSubmitting, setIsSumbitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTitleClear, setIsTitleClear] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.load));
  }, []);

  async function handleAddTodo(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const title = event.currentTarget.value.trim();

      if (!title) {
        setErrorMessage(ErrorMessage.title);

        return;
      }

      setIsSumbitting(true);
      setTempTodo({
        title,
        ...todoProperties,
        id: 0,
      });

      try {
        const newTodo = await addTodos({
          title,
          ...todoProperties,
        });

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setIsTitleClear(true);
      } catch {
        setErrorMessage(ErrorMessage.add);
      } finally {
        setIsSumbitting(false);
        setTempTodo(null);
      }
    }
  }

  async function handleDeleteTodo(todoId: number) {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodoList => prevTodoList.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.delete);
    }
  }

  async function handleClearCompletedTodos() {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      const failedDeletions: number[] = [];

      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
          } catch {
            failedDeletions.push(todo.id);
          }
        }),
      );

      setTodos(prevTodos =>
        prevTodos.filter(
          todo => !todo.completed || failedDeletions.includes(todo.id),
        ),
      );

      if (failedDeletions.length > 0) {
        setErrorMessage(ErrorMessage.delete);
      }
    } catch (error) {
      setErrorMessage(ErrorMessage.delete);
    }
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const filtredTodos = getFiltredTodos(todos, activeFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSumbit={handleAddTodo}
          isSubmitting={isSubmitting}
          isTitleClear={isTitleClear}
          onSetIsTitleClear={setIsTitleClear}
        />

        <TodoList
          todos={filtredTodos}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          onSetErrorMessage={setErrorMessage}
          isSubmitting={isSubmitting}
        />

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onClearCompleted={handleClearCompletedTodos}
          />
        )}
      </div>

      <ErrorField
        errorMessage={errorMessage}
        onSetErrorMessage={setErrorMessage}
      />
    </div>
  );
};
