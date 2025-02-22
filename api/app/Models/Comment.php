<?php

namespace App\Models;

use Core\Model;

class Comment extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'comments';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'content', 'user_id', 'parent_id', 'news_id', 'product_id', 'created_at', 'updated_at'];
}
