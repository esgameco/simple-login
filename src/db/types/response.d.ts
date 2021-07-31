export interface CreateResponse {
    error?: string;
};

export interface UpdateResponse extends CreateResponse {};

export interface GetResponse<T> {
    exists: boolean;
    data?: T;
    error?: string;
};