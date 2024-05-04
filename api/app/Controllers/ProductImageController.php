<?php

namespace App\Controllers;

use Core\Controller;

class ProductImageController extends Controller
{
    private $productImageModel;

    /**
     * ProductImageController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->productImageModel = $this->model('productImage');
    }

    /**
     * Get product images.
     *
     * @return  string  The JSON response
     */
    public function getProductImages()
    {
        $queryParams = $this->request->params();
        $productImages = $this->productImageModel->getMultiple($queryParams);

        if ($productImages === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $productImages,
        );
    }

    /**
     * Get a product image by ID.
     *
     * @param    int         $id The ID of the product image to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $productImage = $this->productImageModel->getById($id);

        if ($productImage === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $productImage
        );
    }

    /**
     * Create a new product image.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $productImageData = $this->request->body();
        $validationResult = $this->request->validate($productImageData, [
            'product_id' => 'required',
            'src' => 'required|max:255'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $result = $this->productImageModel->create($productImageData);
        if ($result === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(201)->json(
            1,
            [],
            'Product image created successfully.'
        );
    }

    /**
     * Delete a product image.
     *
     * @param    int        $id The ID of the product image to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->productImageModel->delete($id);

        if ($result === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            [],
            'Product image deleted successfully.'
        );
    }
}
