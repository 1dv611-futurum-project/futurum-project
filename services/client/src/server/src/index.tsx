import * as http from 'http';
import App from './App';

const port = process.env.PORT || 3000;
const server = http.createServer(App);

App.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`Server is listening on ${port}`);
});
