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
        $query = "SELECT stories.id, stories.name, stories.description as description,stories.status as status, ROUND(AVG(story_points.points),1) AS average_points,
        stories.reveal as reveal FROM stories
                    LEFT JOIN story_points ON stories.id = story_points.story_id
                    WHERE stories.session_id = :session_id
                    GROUP BY stories.id";

        $statement = $conn->prepare($query);
        $statement->bindParam(':session_id', $session_id, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $returnData = [
                'success' => 1,
                'message' => 'Stories Found',
                'data' => $result,
            ];
        } else {
            $returnData = msg(0, 204, 'No Stories Found');
        }
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);