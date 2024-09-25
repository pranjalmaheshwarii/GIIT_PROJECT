const express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes')
var cors = require('cors')

const app = express();

app.use(cors())

app.set("view engine", 'ejs')

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
