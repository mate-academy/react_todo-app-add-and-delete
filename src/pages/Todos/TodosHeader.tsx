import { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import TodosAsync from '../../store/todos/todosAsync';
import { todosActions } from '../../store/todos/todosSlice';
import { selectCurrentUser } from '../../store/users/usersSelectors';
import {
  selectCompletedTodosIds,
  selectActiveTodosIds,
  selectTodos,
} from '../../store/todos/todosSelectors';

interface Form {
  title: string;
}

const TodosHeader:FC = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const todos = useAppSelector(selectTodos);
  const completedTodosIds:number[] = useAppSelector(selectCompletedTodosIds);
  const activeTodosIds:number[] = useAppSelector(selectActiveTodosIds);

  const allCompleted = completedTodosIds.length === todos?.length;

  const { control, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = handleSubmit((data: Form) => {
    const { title } = data;

    if (!currentUser) {
      return;
    }

    if (!title.trim()) {
      dispatch(todosActions.setError('Title can\'t be empty'));

      return;
    }

    dispatch(TodosAsync.createTodo({
      title: data.title,
      completed: false,
      userId: currentUser.id,
    })).unwrap()
      .then(() => reset({ title: '' }));
  });

  const createTodo = (e: { key: string; }) => {
    if (e.key !== 'Enter') {
      return;
    }

    onSubmit();
  };

  const checkAll = () => {
    if (allCompleted) {
      dispatch(todosActions.setLoadingTodos(completedTodosIds));
      completedTodosIds.forEach((todoId: number) => {
        dispatch(TodosAsync.updateTodo({ id: todoId, completed: false }));
      });
    } else {
      dispatch(todosActions.setLoadingTodos(activeTodosIds));
      activeTodosIds.forEach((todoId: number) => {
        dispatch(TodosAsync.updateTodo({ id: todoId, completed: true }));
      });
    }

    setTimeout(() => {
      dispatch(todosActions.setInitialField('loadingTodosIds'));
    }, 100);
  };

  return (
    <header className="todoapp__header">
      {!!todos?.length && (
        // eslint-disable-next-line
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={`
            todoapp__toggle-all
            ${allCompleted ? 'active' : ''}
          `}
          onClick={checkAll}
        />
      )}

      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <input
              {...field}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onKeyDown={createTodo}
            />
          )}
        />
      </form>
    </header>
  );
};

export default TodosHeader;
