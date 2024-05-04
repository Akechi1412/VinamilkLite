<?php

use App\Controllers\ProductImageController;
use App\Middlewares\AuthMiddleware;

$productImageController = new ProductImageController();

$router->post('/product-images', function () use ($productImageController) {
    echo $productImageController->create();
})->addMiddleware(new AuthMiddleware(true));

$router->get('/product-images', function () use ($productImageController) {
    echo $productImageController->getProductImages();
});

$router->get('/product-images/:id', function ($params) use ($productImageController) {
    echo $productImageController->getById($params['id']);
});

$router->delete('/product-images/:id', function ($params) use ($productImageController) {
    echo $productImageController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));
