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

    /**
     * Get a collection by slug from the table.
     *
     * @param   string  $slug The slug of the collection to select
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
