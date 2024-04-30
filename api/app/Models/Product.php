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
    protected $selectedFields = ['id', 'name', 'slug', 'thumbnail', 'hidden', 'description', 'benefit', 'ingredient', 'user_manual', 'brand_id', 'product_type_id'];
}
