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
    $user_id = filter_input(INPUT_GET, 'user_id', FILTER_SANITIZE_NUMBER_INT);
    try {
        $query = "SELECT sessions.id as id, sessions.name as name, sessions.description as description,
                    sessions.created_at FROM sessions INNER JOIN participants ON participants.session_id = sessions.id
                    WHERE sessions.status = 'closed' AND participants.user_id = :user_id AND participants.role = 'moderator'
                    ORDER BY created_at DESC";
        $statement = $conn->prepare($query);
        $statement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $returnData = [
                'success' => 1,
                'message' => 'Sessions Found',
                'data' => $result
            ];
        } else {
            $returnData = msg(0, 204, 'No Sessions Found');
        }
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }




endif;

echo json_encode($returnData);