<?php

namespace Core;

use Exception;
use finfo;

class Database
{
    private $connection = null;
    private $sql = '';
    private $table = null;
    private $statement = null;
    private $params = [];

    /**
     * Database constructor
     */
    public function __construct()
    {
        $this->connection = (new DatabaseConnector)->getConnection();
    }

    /**
     * Set the table to be used for the next query.
     *
     * @param   string      $table The name of the table to be used
     * @return  Database    The current Database instance
     */
    public function table(string $table)
    {
        $this->table = $table;
        return $this;
    }

    /**
     * Set the custom sql query.
     *
     * @param   string      $sql The sql query
     * @return  Database    The current Database instance
     */
    public function sql(string $sql)
    {
        if (empty($sql)) {
            throw new Exception('SQL query cannot be empty!');
        }

        $this->sql = $sql;
        return $this;
    }

    /**
     * Set the params for custom sql to excute sql query.
     *
     * @param   array      $params
     * @return  Database    The current Database instance
     */
    public function params(array $params)
    {
        if (empty($params)) {
            throw new Exception('Params cannot be empty!');
        }

        $this->params = $params;
        return $this;
    }

    /**
     * Prepare an INSERT SQL statement.
     *
     * @param   array       $data data to be inserted
     * @return  Database    The current Database instance
     */
    public function insert(array $data)
    {
        if (empty($data)) {
            throw new Exception('The insert fields cannot be empty!');
        }

        $fields = array_keys($data);
        $this->params = $data;

        $placeholders = implode(', ', array_fill(0, count($fields), '?'));
        $sql = 'INSERT INTO ' . $this->table . ' (' . implode(', ', $fields) . ') VALUES (' . $placeholders . ')';
        $this->sql = $sql;
        $this->statement = 'insert';

        return $this;
    }

    /**
     * Prepare an UPDATE SQL statement.
     *
     * @param   array       $data data to be updated
     * @return  Database    The current Database instance
     */
    public function update(array $data)
    {
        if (empty($data)) {
            throw new Exception('The update fields cannot be empty!');
        }

        $fields = array_keys($data);
        $this->params = $data;

        $totalFields = count($fields);
        $i = 1;
        $sql = 'UPDATE ' . $this->table . ' SET';

        foreach ($fields as $field) {
            $sql .= ' ' . $field . ' = ?' . (($i == $totalFields) ? '' : ',');
            $i++;
        }

        $this->sql = $sql;
        $this->statement = 'update';

        return $this;
    }

    /**
     * Add a WHERE clause to the SQL statement.
     *
     * @param   array       $fields The fields to be used in the WHERE clause
     * @return  Database    The current Database instance
     */
    public function where($params = [])
    {
        if (empty($params)) {
            return $this;
        }

        $fields = array_keys($params);
        $sql = ' WHERE ';
        $conditions = array_map(function ($field) use ($params) {
            if (substr($field, -5) === '_like') {
                $newField = substr($field, 0, -5);
                $this->params[$newField] = '%' . $params[$field] . '%';
                return $newField . ' LIKE ?';
            } else if (substr($field, -3) === '_gt') {
                $newField = substr($field, 0, -3);
                $this->params[$newField] = $params[$field];
                return $newField . ' > ?';
            } else if (substr($field, -3) === '_lt') {
                $newField = substr($field, 0, -3);
                $this->params[$newField] = $params[$field];
                return $newField . ' < ?';
            } else if (substr($field, -4) === '_gte') {
                $newField = substr($field, 0, -4);
                $this->params[$newField] = $params[$field];
                return $newField . ' >= ?';
            } else if (substr($field, -4) === '_lte') {
                $newField = substr($field, 0, -4);
                $this->params[$newField] = $params[$field];
                return $newField . ' <= ?';
            } else if (substr($field, -3) === '_ne') {
                $newField = substr($field, 0, -3);
                $this->params[$newField] = $params[$field];
                return $newField . ' <> ?';
            } else {
                $this->params[$field] = $params[$field];
                return $field . ' = ?';
            }
        }, $fields);

        $sql .= implode(' AND ', $conditions);
        $this->sql .= $sql;

        return $this;
    }

    /**
     * Add a LIMIT clause to the SQL statement.
     *
     * @param   int         $offset
     * @param   int         $limit
     * @return  Database    The current Database instance
     */
    public function limit($offset = 0, $limit = 10)
    {
        $sql = ' LIMIT ' . $offset . ', ' . $limit;
        $this->sql .= $sql;

        return $this;
    }

    /**
     * Add a ORDER clause to the SQL statement.
     *
     * @param   string[]    $fields 
     * @return  Database    The current Database instance
     */
    public function orderBy($fields = [])
    {
        if (empty($fields)) {
            return $this;
        }

        $sql = ' ORDER BY ';
        $conditions = array_map(function ($field) {
            if (strpos($field, '-') === 0) {
                $field = ltrim($field, '-');
                return $field . ' DESC';
            } else {
                return $field . ' ASC';
            }
        }, $fields);

        $sql .= implode(', ', $conditions);
        $this->sql .= $sql;

        return $this;
    }

    /**
     * Prepare a SELECT SQL statement.
     *
     * @param   array       $fields The fields to be selected
     * @return  Database    The current Database instance
     */
    public function select($fields = [])
    {
        $sql = '';
        if (empty($fields)) {
            $sql = 'SELECT *  FROM ' . $this->table;
        } else {
            $sql = 'SELECT ' . implode(', ', $fields) . ' FROM ' . $this->table;
        }

        $this->sql = $sql;
        $this->statement = 'select';

        return $this;
    }

    /**
     * Prepare a SELECT COUNT SQL statement.
     *
     * @param   string      $field to count or * to count all
     * @param   string      $alias for key of result, default totalRows
     * @return  Database    The current Database instance
     */
    public function count($field = '*', $alias = 'totalRows')
    {
        $sql = 'SELECT COUNT(' . $field . ') AS ' . $alias . ' FROM ' . $this->table;
        $this->sql = $sql;
        $this->statement = 'select';

        return $this;
    }

    /**
     * Prepare a DELETE SQL statement.
     *
     * @return  Database  The current Database instance
     */
    public function delete()
    {
        $sql = 'DELETE FROM ' . $this->table;
        $this->sql = $sql;
        $this->statement = 'delete';

        return $this;
    }

    /**
     * Execute the prepared SQL statement.
     *
     * @return  mixed   The result of the execution, either an array of results or a boolean indicating success or failure
     */
    public function execute()
    {
        try {
            $stmt = $this->connection->prepare($this->sql);

            if (!$stmt) {
                return false;
            }

            if (!empty($this->params)) {
                $types = '';
                $params = [];
                foreach ($this->params as $value) {
                    if (is_int($value)) {
                        $types .= 'i'; // integer
                        $value = (int)$value;
                    } elseif (is_double($value)) {
                        $types .= 'd'; // double
                        $value = (float)$value;
                    } elseif (is_string($value)) {
                        $types .= 's'; // string
                    } else {
                        $types .= 's'; // default to string
                    }

                    $params[] = $value;
                }

                if (!$stmt->bind_param($types, ...$params)) {
                    return false;
                }
            }

            if ($stmt->execute()) {
                if ($this->statement === 'select') {
                    $result = $stmt->get_result();
                    $data = $result->fetch_all(MYSQLI_ASSOC);
                    $result->close();

                    return $data;
                }

                return true;
            } else {
                return false;
            }
        } catch (Exception $error) {
            throw new Exception($error->getMessage() . '. SQL Query: ' . $this->sql . '.');
        } finally {
            $this->sql = '';
            $this->table = '';
            $this->params = [];
        }
    }

    /**
     * Begin a transaction
     * 
     * @return void
     */
    public function beginTransaction()
    {
        $this->connection->begin_transaction();
    }

    /**
     * Commit a transaction
     * 
     * @return void
     */
    public function commitTransaction()
    {
        $this->connection->commit();
    }

    /**
     * Rollback a transaction
     * 
     * @return void
     */
    public function rollbackTransaction()
    {
        $this->connection->rollback();
    }

    /**
     * Close database connection.
     *
     * @return  void
     */
    public function closeConnection()
    {
        if ($this->connection) {
            $this->connection->close();
        }
    }
}
