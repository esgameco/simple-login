import express, {
    Application,
    Request,
    Response
} from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

// Define app
const app: Application = express();
const port: number = 8080;

// Usages
app.use(cookieParser()); // Cookie Parser
app.use(express.static(path.join(__dirname, 'public'))) // Public directory

app.get('/', (req: Request, res: Response) => {
    res.sendFile('./public/index.html');
});

app.listen(port, () => console.log('Connected on', port));