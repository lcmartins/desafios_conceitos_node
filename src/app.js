const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const { uuid } = require('uuidv4');

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.status(201).send(repository);
});

function findRepositoryById(id) {
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  return repositoryIndex;
}

function formatNotFoundResponse(id) {
  return `Repository with id: ${id} not found!`;
}

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findRepositoryById(id);
  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: formatNotFoundResponse(id),
    });
  }
  const { title, url, techs } = request.body;

  const repository = repositories[repositoryIndex];
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.status(200).json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findRepositoryById(id);
  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: `Repository with id: ${id} not found!`,
    });
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findRepositoryById(id);
  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: `Repository with id: ${id} not found!`,
    });
  }
  const repository = repositories[repositoryIndex];

  repository.likes += 1;
  return response.status(200).json(repository);
});

module.exports = app;
