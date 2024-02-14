const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config.env");

const PORT = port || 3050;

const server = app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log(" Exit server Express");
//   });
// });
