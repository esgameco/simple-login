import { createBookTable } from "../modules/books/db/setup";
import { createUserTable } from "../modules/auth/db/setup";

const setup = async () => {
    await createBookTable();
    await createUserTable();
};

export default setup;