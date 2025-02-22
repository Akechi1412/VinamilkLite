<?php

use App\Controllers\UserController;
use App\Middlewares\AuthMiddleware;

$userController = new UserController();

$router->post('/users', function () use ($userController) {
    echo $userController->create();
})->addMiddleware(new AuthMiddleware(true));

$router->patch('/users/:id', function ($params) use ($userController) {
    echo $userController->update($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/users', function () use ($userController) {
    echo $userController->getUsers();
})->addMiddleware(new AuthMiddleware(true));

$router->get('/users/:id', function ($params) use ($userController) {
    echo $userController->getById($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/users/:id/public', function ($params) use ($userController) {
    echo $userController->getPublicInfo($params['id']);
});

$router->delete('/users/:id', function ($params) use ($userController) {
    echo $userController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));
