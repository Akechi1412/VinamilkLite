<?php

use App\Controllers\UserController;
use App\Controllers\ProductController;
use App\Middlewares\AuthMiddleware;

$userController = new UserController();

$productController = new ProductController();

$router->post('/users', function () use ($userController) {
    echo $userController->create();
})->addMiddleware(new AuthMiddleware(true));

$router->patch('/users/:id', function ($params) use ($userController) {
    echo $userController->update($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->put('/users/:id', function ($params) use ($userController) {
    echo $userController->updateAll($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/users', function () use ($userController) {
    echo $userController->getUsers();
})->addMiddleware(new AuthMiddleware(true));

$router->get('/users/:id', function ($params) use ($userController) {
    echo $userController->getById($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->delete('/users/:id', function ($params) use ($userController) {
    echo $userController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));

// Product start
$router->get('/products', function () use ($productController) {
    echo $productController->getProducts();
});

$router->get('/products/:id', function ($params) use ($productController) {
    echo $productController->getById($params['id']);
});

$router->post('/products', function () use ($productController) {
    echo $productController->create();
});

$router->patch('/products/:id', function ($params) use ($productController) {
    echo $productController->update($params['id']);
});

$router->put('/products/:id', function ($params) use ($productController) {
    echo $productController->updateAll($params['id']);
});

$router->delete('/products/:id', function ($params) use ($productController) {
    echo $productController->delete($params['id']);
});

// Product end