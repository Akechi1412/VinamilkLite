<?php

use App\Controllers\AddressController;
use App\Middlewares\AuthMiddleware;

$addressController = new AddressController();

$router->get('/addresses/provinces', function () use ($addressController) {
    echo $addressController->getProvinces();
});

$router->get('/addresses/districts/:provinceId', function ($params) use ($addressController) {
    echo $addressController->getDistricts($params['provinceId']);
});

$router->get('/addresses/wards/:districtId', function ($params) use ($addressController) {
    echo $addressController->getWards($params['districtId']);
});

$router->post('/addresses', function () use ($addressController) {
    echo $addressController->create();
})->addMiddleware(new AuthMiddleware());

$router->patch('/addresses/:id', function ($params) use ($addressController) {
    echo $addressController->update($params['id']);
})->addMiddleware(new AuthMiddleware());

$router->get('/addresses', function () use ($addressController) {
    echo $addressController->getAddresses();
})->addMiddleware(new AuthMiddleware(true));

$router->get('/addresses/user', function () use ($addressController) {
    echo $addressController->getUserAddresses();
})->addMiddleware(new AuthMiddleware());

$router->get('/addresses/:id', function ($params) use ($addressController) {
    echo $addressController->getById($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->delete('/addresses/:id', function ($params) use ($addressController) {
    echo $addressController->delete($params['id']);
})->addMiddleware(new AuthMiddleware());
