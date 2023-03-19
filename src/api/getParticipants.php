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

    $session_id = filter_input(INPUT_GET, 'session_id', FILTER_SANITIZE_STRING);
    try {
        $query = "SELECT users.id as id, users.name as name, participants.role as role, sessions.name as session_name
                FROM participants
                INNER JOIN users ON participants.user_id = users.id
                INNER JOIN sessions ON participants.session_id = sessions.id
                WHERE participants.session_id = :session_id";

        $statement = $conn->prepare($query);
        $statement->bindValue(':session_id', $session_id, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            $returnData = [
                'success' => 1,
                'message' => 'Participants Found',
                'data' => $result
            ];
        } else {
            $returnData = msg(0, 204, 'No Participants Found');
        }
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);