<?php

namespace App\Models;

use Core\Model;

class Contact extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'contacts';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'email', 'full_name', 'content', 'solved', 'created_at', 'updated_at'];
}
