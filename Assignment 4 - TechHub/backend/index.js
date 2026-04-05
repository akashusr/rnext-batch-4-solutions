const app = require('./src/app');
const db = require('./src/models');

const PORT = 9000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
