<?php

namespace App\Controllers;

use Core\Controller;

class ProductController extends Controller
{
    private $productModel;

    /**
     * ProductController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->productModel = $this->model('product');
    }

    /**
     * Get products.
     *
     * @return  string  The JSON response
     */
    public function getProducts()
    {
        $queryParams = $this->request->params();
        $products = $this->productModel->getMultiple($queryParams);

        if ($products === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $products,
        );
    }

    /**
     * Get a product by ID.
     *
     * @param    int         $id The ID of the product to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $product = $this->productModel->getById($id);

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
     * Create a new product.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $productData = $this->request->body();
        $validationResult = $this->request->validate($productData, [
            'name' => 'required|unique:products',
            'slug' => 'required',
            'thumbnail' => 'required',
            'hidden',
            'description',
            'benefit',
            'ingredient',
            'user_manual',
            'brand_id' => 'required',
            'product_type_id' => 'required',
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $productData['id'] = uniqid('product');

        $datetime = date('Y-m-d H:i:s');
        $productData['created_at'] = $datetime;
        $productData['updated_at'] = $datetime;

        $result = $this->productModel->create($productData);
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
            'Product created successfully.'
        );
    }

    /**
     * Update a Product with some attributes.
     *
     * @param    int        $id The ID of the product to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $productData = $this->request->body();
        $validationResult = $this->request->validate($productData, [
            'name' => 'unique:products',
            'slug' => '',
            'thumbnail' => '',
            'hidden',
            'description',
            'benefit',
            'ingredient',
            'user_manual',
            'brand_id' => '',
            'product_type_id' => ''
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $productData['updated_at'] = $datetime;

        $result = $this->productModel->update($productData, $id);
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
            'Product updated successfully.'
        );
    }

    /**
     * Update a Product with all attributes.
     *
     * @param    int        $id The ID of the product to update
     * @return   string     The JSON response
     */
    public function updateAll($id)
    {
        $productData = $this->request->body();
        $validationResult = $this->request->validate($productData, [
            'name' => 'required|unique:products',
            'slug' => 'required',
            'thumbnail' => 'required',
            'hidden',
            'description',
            'benefit',
            'ingredient',
            'user_manual',
            'brand_id' => 'required',
            'product_type_id' => 'required'
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $productData['updated_at'] = $datetime;

        $result = $this->productModel->updateAll($productData, $id);
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
            'Product updated successfully.'
        );
    }

    /**
     * Delete a product.
     *
     * @param    int        $id The ID of the product to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->productModel->delete($id);

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
            'Product deleted successfully.'
        );
    }
}
