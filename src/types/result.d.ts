export type Result<T> = {
  status: boolean;
  data: T;
}

export type MessageResult = Result<{message: string}>;
