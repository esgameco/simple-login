import express, {
    Application,
    Request,
    Response
} from 'express';

const app: Application = express();
const port: number = 8080;

app.get('/', (req: Request, res: Response) => {
    res.send('test')
});

app.listen(port, () => console.log('Connected on', port));