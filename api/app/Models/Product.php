<?php

namespace App\Models;

use Core\Model;

class Product extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'products';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'name', 'slug', 'thumbnail', 'hidden', 'description', 'price', 'sale_price', 'collection_id', 'created_at', 'updated_at'];

    /**
     * Get a product by slug from the table.
     *
     * @param   string  $slug The slug of the product to select
     * @return  mixed   Array of results if successful, false otherwise
     */
    public function getBySlug($slug)
    {
        $result =  $this->db->table($this->tableName)
            ->select($this->selectedFields)
            ->where(['slug' => $slug])->execute();

        if (!empty($result)) {
            return $result[0];
        } else {
            return [];
        }
    }
}
