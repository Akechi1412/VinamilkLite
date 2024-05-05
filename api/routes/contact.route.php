<?php

use App\Controllers\ContactController;
use App\Middlewares\AuthMiddleware;

$contactController = new ContactController();

$router->post('/contacts/submit', function () use ($contactController) {
    echo $contactController->create();
});

$router->patch('/contacts/response/:id', function ($params) use ($contactController) {
    echo $contactController->response($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->patch('/contacts/:id', function ($params) use ($contactController) {
    echo $contactController->update($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->get('/contacts', function () use ($contactController) {
    echo $contactController->getContacts();
})->addMiddleware(new AuthMiddleware(true));

$router->get('/contacts/:id', function ($params) use ($contactController) {
    echo $contactController->getById($params['id']);
})->addMiddleware(new AuthMiddleware(true));

$router->delete('/contacts/:id', function ($params) use ($contactController) {
    echo $contactController->delete($params['id']);
})->addMiddleware(new AuthMiddleware(true));
