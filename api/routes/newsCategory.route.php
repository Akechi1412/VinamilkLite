<?php

use App\Controllers\NewsCategoryController;
use App\Middlewares\AuthMiddleware;

$newsCategoryController = new NewsCategoryController();

$router->post('/news-categories', function () use ($newsCategoryController) {
    echo $newsCategoryController->create();
})->addMiddleware(new AuthMiddleware(true));

$router->patch('/news-categories/:id', function ($params) use ($newsCategoryController) {
    echo $newsCategoryController->update($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/news-categories', function () use ($newsCategoryController) {
    echo $newsCategoryController->getNewsCatgories();
});

$router->get('/news-categories/:id', function ($params) use ($newsCategoryController) {
    echo $newsCategoryController->getById($params['id']);
});

$router->delete('/news-categories/:id', function ($params) use ($newsCategoryController) {
    echo $newsCategoryController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));
