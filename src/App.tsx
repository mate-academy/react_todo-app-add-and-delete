import React, { useEffect, useState } from 'react';
import { deleteTodo, getTodos, createTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoCompletedCategory } from './types/TodoCompletedCategory';
import { filterTodosByComplated } from './utils/filterTodosByCompleted';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedCategory, setCompletedCategory] =
    useState<TodoCompletedCategory>(TodoCompletedCategory.all);
  const [errorMessage, setErrorMessage] = useState<string>(Errors.noneError);
  const [removedTodosId, setRemovedTodosId] = useState([0]);

  const filteredTodos = filterTodosByComplated(todos, completedCategory);
  const countOfCompletedTodos = todos.filter(todo => todo.completed).length;
  const countOfNotCompletedTodos = todos.length - countOfCompletedTodos;
  const isSomeTodoComplated = todos.some(todo => todo.completed);

  async function fetchTodosFromApi() {
    try {
      const todosFromApi = await getTodos();

      setTodos(todosFromApi);
    } catch {
      setErrorMessage(Errors.loadError);
    }
  }

  async function handleAddTodo(newTitle: string) {
    const formatedTitle = newTitle.trim();

    if (!formatedTitle) {
      throw new Error(Errors.emptyTitleError);
    }

    let newTodo: Todo = {
      id: 0,
      title: formatedTitle,
      userId: 0,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      newTodo = await createTodo(formatedTitle);
    } catch {
      throw new Error(Errors.addError);
    } finally {
      setTempTodo(null);
      if (newTodo.id !== 0) {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      }
    }
  }

  async function handleDeleteTodo(todoId: number) {
    try {
      setRemovedTodosId(current => [...current, todoId]);
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Errors.deleteError);
    } finally {
      setRemovedTodosId(current => current.filter(id => id === todoId));
    }
  }

  function deleteAllCompletedTodos() {
    const completedTodosId: number[] = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(
      completedTodosId.map(async id => {
        await handleDeleteTodo(id);
      }),
    );
  }

  useEffect(() => {
    fetchTodosFromApi();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          countOfTodos={todos.length}
          countOfCompletedTodos={countOfCompletedTodos}
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
        />
        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              removedTodosId={removedTodosId}
              onDeleteTodo={handleDeleteTodo}
            />
            <TodoFooter
              countOfNotCompletedTodos={countOfNotCompletedTodos}
              isSomeTodoComplated={isSomeTodoComplated}
              completedCategory={completedCategory}
              onCompletedCategory={setCompletedCategory}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
