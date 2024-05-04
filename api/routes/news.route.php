<?php

use App\Controllers\NewsController;
use App\Middlewares\AuthMiddleware;

$newsController = new NewsController();

$router->post('/news', function () use ($newsController) {
    echo $newsController->create();
})->addMiddleware(new AuthMiddleware(true));

$router->patch('/news/:id', function ($params) use ($newsController) {
    echo $newsController->update($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/news', function () use ($newsController) {
    echo $newsController->getNews();
});

$router->get('/news/:id', function ($params) use ($newsController) {
    echo $newsController->getById($params['id']);
});

$router->delete('/news/:id', function ($params) use ($newsController) {
    echo $newsController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));
