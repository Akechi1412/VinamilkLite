<?php

namespace App\Models;

use Core\Model;

class Collection extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'collections';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'name', 'slug', 'image', 'collection_order', 'created_at', 'updated_at'];
}
