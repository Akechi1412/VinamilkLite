<?php

use App\Controllers\CollectionController;
use App\Middlewares\AuthMiddleware;

$collectionController = new CollectionController();

$router->post('/collections', function () use ($collectionController) {
    echo $collectionController->create();
})->addMiddleware(new AuthMiddleware(true));

$router->patch('/collections/:id', function ($params) use ($collectionController) {
    echo $collectionController->update($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/collections', function () use ($collectionController) {
    echo $collectionController->getCollections();
});

$router->get('/collections/:id', function ($params) use ($collectionController) {
    echo $collectionController->getById($params['id']);
});

$router->delete('/collections/:id', function ($params) use ($collectionController) {
    echo $collectionController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));
