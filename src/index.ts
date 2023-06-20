import { Server } from "./server";

const server = new Server().app;
const PORT = '3000';

server.listen(PORT, () => {
    console.log("Server is running at PORT ",PORT)
})

