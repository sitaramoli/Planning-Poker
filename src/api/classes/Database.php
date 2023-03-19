<?php
class Database
{
    private $db_host = 'localhost';
    private $db_user = 'root';
    private $db_password = '2055';
    private $db_name = 'poker_planning';

    public function dbConnection()
    {
        try {
            $conn = new PDO('mysql:host=' . $this->db_host . ';dbname=' . $this->db_name, $this->db_user, $this->db_password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            echo 'Connection error' . $e->getMessage();
            exit;
        }
    }
}
?>