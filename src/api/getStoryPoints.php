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
    $story_id = filter_input(INPUT_GET, 'story_id', FILTER_SANITIZE_NUMBER_INT);

    try {
        $query = "SELECT users.id, users.name, story_points.points
                FROM story_points
                INNER JOIN users ON users.id = story_points.user_id
                WHERE story_points.story_id = :story_id
                ORDER BY users.id";
        $statement = $conn->prepare($query);
        $statement->bindParam(':story_id', $story_id, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            $returnData = [
                'success' => 1,
                'message' => 'Story Points Found',
                'data' => $result,
            ];
        } else {
            $returnData = msg(0, 204, 'No Story Points Found');
        }
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);