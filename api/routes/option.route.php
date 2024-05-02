<?php

use App\Controllers\OptionController;
use App\Middlewares\AuthMiddleware;

$optionController = new OptionController();

$router->patch('/options/:key', function ($params) use ($optionController) {
    echo $optionController->update($params['key']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/options', function () use ($optionController) {
    echo $optionController->getOptions();
});

$router->get('/options/:key', function ($params) use ($optionController) {
    echo $optionController->getByKey($params['key']);
});
