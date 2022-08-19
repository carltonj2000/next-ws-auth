import axios, {AxiosResponse, AxiosError} from "axios";

import {environment} from "./environment";

export type QueryResponse<T> = [error: string | null, data: T | null];

export const refreshTokens = async () => {
  await axios.post(`${environment.apiUrl}/refresh`, undefined, {
    withCredentials: true,
  });
};

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.get(url, {withCredentials: true});
    const {data} = await handleRequest(request);
    return [null, data];
  } catch (error) {
    return [error as string, null];
  }
};

const handleRequest = async (
  request: () => Promise<AxiosResponse>
): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error) {
    const e = error as AxiosError;
    if (e?.response?.status === 401) {
      try {
        await refreshTokens();
        return await request();
      } catch (innerError) {
        throw getError(innerError as AxiosError);
      }
    }

    throw getError(error as AxiosError);
  }
};

export const getError = (error: AxiosError) => {
  if (error.isAxiosError && error.response) return error.response.data;
  return "Unexpected error";
};
