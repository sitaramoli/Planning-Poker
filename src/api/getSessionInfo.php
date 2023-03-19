<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();

function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message,
    ], $extra);
}

// DATA FORM REQUEST
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

if ($_SERVER["REQUEST_METHOD"] != "GET"):

    $returnData = msg(0, 404, 'Page Not Found!');

    // IF THERE ARE NO EMPTY FIELDS THEN-
else:

    $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_STRING);
    try {
        $query = "SELECT sessions.id as `id`,sessions.name AS `name`, sessions.description AS `description`,sessions.status as status from `sessions`
                WHERE id = :id";

        $statement = $conn->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $returnData = [
                'success' => 1,
                'message' => 'Session Found',
                'data' => $result
            ];
        } else {
            $returnData = msg(0, 204, 'No Session Found');
        }
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);