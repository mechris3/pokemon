import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getEvolutionChain } from './pokemon';

const app = express();
const port = process.env.PORT || 3002;

app.use(
    cors({
        origin: '*',
    })
);

app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log('App listening on port ', port);
    if (process.send) {
        process.send(`Server running at http://localhost:${port}\n\n`);
    }
});


app.get('/', (request: Request, response: Response) => {
    response.json({});
});

app.get('/:pokemonName', (request: Request, response: Response) => {
    const pokemonName = request.params['pokemonName'];
    getEvolutionChain(pokemonName).then((evolutionChain) => {
        response.json(evolutionChain);
    }).catch((error) => {
        console.error('Error:', error);
    });

});
