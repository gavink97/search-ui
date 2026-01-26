import { createServer } from 'node:http';
import next from 'next';
import 'dotenv/config';

const hostname = process.env.HOST ?? '0.0.0.0';
const port = parseInt(process.env.PORT ?? '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => {
		handle(req, res);
	}).listen(port);
});

console.log(`> Server listening at ${hostname}:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
