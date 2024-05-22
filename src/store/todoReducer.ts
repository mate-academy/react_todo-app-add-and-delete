import { Action, ActionTypes, FilterFields, TodoState } from './types';

export const initialState: TodoState = {
  todos: [],
  tempTodo: null,
  filter: FilterFields.All,
  isLoading: false,
  error: null,
  refresh: 0,
};

export const reducer = (state: TodoState, action: Action) => {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case ActionTypes.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };
    case ActionTypes.SET_REFRESH:
      return {
        ...state,
        refresh: state.refresh + 1,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ActionTypes.ADD_TEMP_TODO:
      return {
        ...state,
        tempTodo: action.payload,
      };
    case ActionTypes.EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, title: action.payload.title }
            : todo,
        ),
      };
    case ActionTypes.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case ActionTypes.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      };
    case ActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case ActionTypes.TOGGLE_ALL_TODOS:
      const allCompleted = state.todos.every(todo => todo.completed);

      return {
        ...state,
        todos: state.todos.map(todo => ({
          ...todo,
          completed: !allCompleted,
        })),
      };
    default:
      return state;
  }
};
