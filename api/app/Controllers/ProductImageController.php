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
        $product = $this->productImageModel->getById($id);

        if ($product === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $product
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
     * Update a product image with some attributes.
     *
     * @param    int        $id The ID of the product image to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $productImageData = $this->request->body();
        if (empty($productImageData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($productImageData, [
            'src' => 'required|max:255'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $result = $this->productImageModel->update($productImageData, $id);
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
            'Product image updated successfully.'
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
