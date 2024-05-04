<?php

namespace App\Models;

use Core\Model;

class ProductImage extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'product_images';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'product_id', 'src'];
}
