<?php

use App\Controllers\CommentController;
use App\Middlewares\AuthMiddleware;

$commentController = new CommentController();

$router->post('/comments', function () use ($commentController) {
    echo $commentController->create();
})->addMiddleware(new AuthMiddleware());

$router->patch('/comments/:id', function ($params) use ($commentController) {
    echo $commentController->update($params['id']);
})->addMiddleware(new AuthMiddleware());

$router->get('/comments', function () use ($commentController) {
    echo $commentController->getComments();
});

$router->get('/comments/:id', function ($params) use ($commentController) {
    echo $commentController->getById($params['id']);
});

$router->delete('/comments/:id', function ($params) use ($commentController) {
    echo $commentController->delete($params['id']);
})->addMiddleware(new AuthMiddleware());
