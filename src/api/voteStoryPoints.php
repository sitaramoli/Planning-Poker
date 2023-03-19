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
        'message' => $message,
    ], $extra);
}

// DATA FORM REQUEST
$data = json_decode(file_get_contents('php://input'), true);
$returnData = [];

if ($_SERVER["REQUEST_METHOD"] != "POST"):

    $returnData = msg(0, 404, 'Page Not Found!');

    // IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $story_id = filter_var($data['story_id'], FILTER_SANITIZE_NUMBER_INT);
    $user_id = filter_var($data['user_id'], FILTER_SANITIZE_NUMBER_INT);
    $story_points = filter_var($data['story_points'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $query = "INSERT INTO `story_points`(`story_id`, `user_id`, `points`) 
                VALUES (:story_id, :user_id, :story_points) 
                ON DUPLICATE KEY UPDATE `points` = :story_points";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':story_id', $story_id, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':story_points', $story_points, PDO::PARAM_INT);
        $stmt->execute();

        $returnData = [
            'success' => 1,
            'message' => 'Story point updated'
        ];
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);