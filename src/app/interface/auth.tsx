export interface Auth
{
    _id?: string,
    username?: string;
    email: string;
    password: string;
    confirmPassword?: string
}
export const INITIAL_USER_REGISTER_DATA: Auth = {
    email: '',
    password: '',
    username: '',
};