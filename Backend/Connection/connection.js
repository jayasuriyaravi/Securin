const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("connect to the mongodb"))
    .catch((err) => console.error("could not connect to the mongoo", err));



