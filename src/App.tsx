import React, { useEffect, useState } from 'react';
import {
  USER_ID,
  clientDeleteTodo,
  clientGetTodos,
  clientPostTodo,
} from './api/todos';

import ErrorNotification from './components/ErrorNotification';
import { TodoType, TodosArrayType } from './types/Todo';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodosFooter from './components/TodosFooter';
import { ErrorStatesType } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodosArrayType>([]);
  const [tempTodo, setTempTodo] = useState<null | TodoType>(null);
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [failCaseStates, setFailCaseStates] = useState<ErrorStatesType>({
    todoLoad: false,
    titleLength: false,
    addTodo: false,
    deleteTodo: false,
    updateTodo: false,
  });
  const [completeFilter, setCompleteFilter] = useState<null | boolean>(null);

  function changeErrorState(
    newVal: boolean,
    errName: keyof ErrorStatesType | 'all' = 'all',
  ) {
    if (errName === 'all') {
      setFailCaseStates({
        todoLoad: false,
        titleLength: false,
        addTodo: false,
        deleteTodo: false,
        updateTodo: false,
      });
    } else {
      setFailCaseStates(prevStates => ({
        ...prevStates,
        [errName]: newVal,
      }));
    }
  }

  async function addTodo(newPostTitle: string) {
    let hasSucceeded = false;

    if (newPostTitle.trim() === '') {
      changeErrorState(true, 'titleLength');
    } else {
      changeErrorState(false, 'titleLength');
      setTempTodo({
        title: newPostTitle,
        userId: USER_ID,
        completed: false,
        id: 0,
      });
      setInputIsDisabled(true);
      await clientPostTodo({
        title: newPostTitle,
        userId: USER_ID,
        completed: false,
      })
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);
          changeErrorState(false, 'addTodo');

          hasSucceeded = true;
        })
        .catch(() => {
          changeErrorState(true, 'addTodo');
        })
        .finally(() => {
          setInputIsDisabled(false);
          setTempTodo(null);
        });
    }

    return hasSucceeded;
  }

  async function deleteTodo(todoId: number) {
    let hasSucceeded = false;

    await clientDeleteTodo(todoId)
      .then(() => {
        hasSucceeded = true;
        setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
        document.getElementById('newTodoInput')?.focus();
        //had to look on the web for focusing input, as i dont think we have learnt useRef yet
      })
      .catch(() => {
        changeErrorState(true, 'deleteTodo');
      });

    return hasSucceeded;
  }

  async function deleteCompletedTodos() {
    const todosToDelete = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    todosToDelete.forEach(todoId => {
      deleteTodo(todoId);
    });
  }

  useEffect(() => {
    clientGetTodos()
      .then(serverTodos => {
        setTodos(
          serverTodos.map(todo => ({
            ...todo,
            isFromServer: true,
          })),
        );
        changeErrorState(false, 'todoLoad');
      })
      .catch(() => {
        changeErrorState(true, 'todoLoad');
      });
  }, []);

  const displayTodos = todos.filter(
    ({ completed }) => completeFilter === null || completed !== completeFilter,
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>
      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          addTodo={addTodo}
          inputIsDisabled={inputIsDisabled}
        />
        <TodoList
          displayTodos={displayTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <TodosFooter
            todos={todos}
            completeFilter={completeFilter}
            setCompleteFilter={setCompleteFilter}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>
      <ErrorNotification
        failCaseStates={failCaseStates}
        changeErrorState={changeErrorState}
      />
    </div>
  );
};
