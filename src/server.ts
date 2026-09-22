import app from "./app";
import { textConnection } from "./config/db";
import { config } from "./config/env";

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})

const startServer = async () => {
    await textConnection()
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    })
};

startServer()