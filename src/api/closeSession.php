<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: PUT");
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
$data = json_decode(file_get_contents('php://input'), true);
$returnData = [];

if ($_SERVER["REQUEST_METHOD"] != "PUT"):

    $returnData = msg(0, 404, 'Page Not Found!');

    // IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $session_id = filter_var($data['session_id'], FILTER_SANITIZE_STRING);
    try {
        $query = "UPDATE `sessions` SET status = 'closed' WHERE id = :session_id";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':session_id', $session_id, PDO::PARAM_STR);
        $stmt->execute();

        $returnData = [
            'success' => 1,
            'message' => 'Session Closed Successfully'
        ];

    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);