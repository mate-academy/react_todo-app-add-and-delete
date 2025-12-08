export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  nodeRef: React.RefObject<unknown>;
}
