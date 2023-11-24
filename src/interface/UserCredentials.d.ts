export type UserCredentials = {
    username: string;
    password: string;
}

export type UserDoc = {
    id: number;
    username: string;
    name: string;
    description: string | null;
    link: string | null;
    photo: string | null;
}
