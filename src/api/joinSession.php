<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
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
        'message' => $message
    ], $extra);
}

// DATA FORM REQUEST
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

if ($_SERVER["REQUEST_METHOD"] != "POST"):

    $returnData = msg(0, 404, 'Page Not Found!');

else:
    $session_id = trim($data->session_id);
    $user_id = trim($data->user_id);
    try {

        // Check if user has already joined the session
        $sel_query = "SELECT * FROM participants WHERE user_id = :user_id AND session_id = :session_id";
        $sel_stmt = $conn->prepare($sel_query);
        $sel_stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $sel_stmt->bindParam(':session_id', $session_id, PDO::PARAM_STR);
        $sel_stmt->execute();

        // If user has already joined the session
        if ($sel_stmt->rowCount()) {
            $returnData = [
                'success' => 1,
                'message' => 'Session joined successfully'
            ];
        }
        // If user has not joined the session yet
        else {
            $insert_query = "INSERT INTO participants (user_id, session_id) VALUES (:user_id, :session_id)";
            $insert_stmt = $conn->prepare($insert_query);
            $insert_stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $insert_stmt->bindParam(':session_id', $session_id, PDO::PARAM_STR);
            $insert_stmt->execute();
            $returnData = [
                'success' => 1,
                'message' => 'Session joined successfully'
            ];
        }
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);