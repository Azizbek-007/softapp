
define('bot_token', $token);

function Answer(array $content)
{
    return endpoint('sendMessage', $content);
}

function buildKeyBoard(array $options, $onetime = false, $resize = true, $selective = true)
{
    $replyMarkup = [
        'keyboard'          => $options,
        'one_time_keyboard' => $onetime,
        'resize_keyboard'   => $resize,
        'selective'         => $selective,
    ];
    $encodedMarkup = json_encode($replyMarkup, true);
    return $encodedMarkup;
}

function endpoint($api, array $content, $post = true)
{
    $url = 'https://api.telegram.org/bot'.bot_token.'/'.$api;
    if ($post) {
        $reply = sendAPIRequest($url, $content);
    } else {
        $reply = sendAPIRequest($url, [], false);
    }
    return json_decode($reply, true);
}

function sendAPIRequest($url, array $content, $post = true)
{
    if (isset($content['chat_id'])) {
        $url = $url.'?chat_id='.$content['chat_id'];
        unset($content['chat_id']);
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    if ($post) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
    }
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($ch);
    if ($result === false) {
        $result = json_encode(['ok'=>false, 'curl_error_code' => curl_errno($ch), 'curl_error' => curl_error($ch)]);
    }
    curl_close($ch);
    return $result;
}

$headers = [
    'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI',
    'Content-Type' => 'application/json'
    ];
    
function CreateLead($payload) {

    GLOBAL $headers;

    
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://api.sales-up.uz/api/v1/lead',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS =>$payload,
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI',
        'Content-Type: application/json'
    ),
    ));

    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    return $httpcode;
    
}

function FindPhone($user_id) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'http://api.sales-up.uz/api/v1/lead/5356014595',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI'
      ),
    ));
    
    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $object = json_decode( $response, true );
    return [$httpcode, $object["phone"]];
    
}
function UpdatePhoneNumber ($payload) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'http://api.sales-up.uz/api/v1/lead/:id?',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS =>$payload,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI',
            'Content-Type: application/json'
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        echo $response;

}

function courses() {
    $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'http://api.sales-up.uz/api/v1/course',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI'
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return json_decode($response, true);
}


function course_info ($course_id) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://api.sales-up.uz/api/v1/course/'.$course_id,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'GET',
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI'
    ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return json_decode($response, true);

}

function createOrder($payload) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://api.sales-up.uz/api/v1/order',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS =>$payload,
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI',
        'Content-Type: application/json'
    ),
    ));

    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    return $httpcode;
}

function courses_btn () {
 
    $array = [];

    foreach (courses() as $x) {
        $array[] = ["text" => $x["name"], "callback_data" => 'CourseID='.$x['id'] ];
    }
    
    $options = json_encode([  
    "inline_keyboard"=> array_chunk($array, 2)
    ]);  

    return $options;

} 
 
$data = json_decode(file_get_contents('php://input'), true);
 
$text = $data["message"]["text"]; 

$chat_id = $data["message"]["from"]["id"];
$first_name = $data["message"]["from"]["first_name"];
$message_id = $data["message"]["message_id"]; 
$last_name = $data["message"]["from"]["last_name"];
  
$callback_data = $data["callback_query"]["data"];
$callback_from_id = $data["callback_query"]["from"]["id"];
$callback_message_id = $data["callback_query"]["message"]["message_id"]; 
$bot_id = explode(':', $token)[0];


$step = []; 




// $regex_simple = "//^[+]?998([- ])?(90|91|93|94|95|98|99|33|97|71)([- ])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$/)/gm";

if (file_get_contents("$chat_id.$bot_id.txt") == "phone") {
    $api_payload = json_encode(["user_id" => "$chat_id", "phone" => "$text", "status" => 0]);
    UpdatePhoneNumber($api_payload);
    $payload = ['chat_id' => $chat_id, 'text' => "Number Ok"];
    Answer($payload);
    unlink("$chat_id.$bot_id.txt");
}

if ($text == '/test') {
    $content = [
                'chat_id' => $chat_id, 
                'text' => "Hi Guy", 
                'parse_mode' => 'markdown',
            ];
    Answer($content); 
}

$menu = [["Kurslar", "Help", "Support"]];

if (mb_stripos($text, '/start') !== false) {
    $text_spilt = explode(' ', $text); 
    if(Count($text_spilt) == 2){
        $payload = json_encode(["user_id" => "$chat_id",  "FIO" => "$first_name $last_name", "instrument" => $text_spilt[1] ]);
        $adad = CreateLead($payload);
    }else{
        $payload = json_encode(["user_id" => "$chat_id",  "FIO" => "$first_name $last_name" ]); 
        $adad = CreateLead($payload);
    }

    $check_phone = FindPhone($chat_id); 
    if($check_phone[0] == 200) {
        if ($check_phone[1] == "0"){
            $content = ['chat_id' => $chat_id, 'text' => "Assalawma aeykum telefon nomerin'izdi kiritin':", 'parse_mode' => 'markdown']; 
            Answer($content);
            file_put_contents("$chat_id.$bot_id.txt", "phone");
        }else{
            $content = [
                'chat_id' => $chat_id, 
                'text' => "Courses", 
                'parse_mode' => 'markdown',
                'reply_markup' => courses_btn()
            ];
            Answer($content);  
        }
    }
}  

if ($callback_data == 'menu'){
    $content = ['chat_id' => $callback_from_id, 'message_id'=>$callback_message_id];
    endpoint('deleteMessage', $content);
    $content = ['chat_id' => $callback_from_id, 'text' => "courses", 'parse_mode' => 'markdown', 
    'reply_markup' => courses_btn()];
    Answer($content);  
}

if(mb_stripos($callback_data, "CourseID=") !== false) {
    $course_id = explode('=', $callback_data)[1];
    $course_information = course_info($course_id);
    $content = [
        'chat_id' => $callback_from_id, 
        'text' => "🔖<b>".$course_information["name"]."</b>\n".$course_information["description"],
        'parse_mode' => "html",
        'reply_markup' => json_encode([
            "inline_keyboard" => [
                [["text" => "Kursqa jaziliw", "callback_data" => "OKCourse=$course_id"]],
                [["text" => "Menu", "callback_data" => "menu"]]
            ]
        ]),
    ];
    Answer($content);  
    $content = ['chat_id' => $callback_from_id, 'message_id'=>$callback_message_id];
    endpoint('deleteMessage', $content);
}

if(mb_stripos($callback_data, "OKCourse=") !== false) {
    $course_id = explode('=', $callback_data)[1];
    $payload = json_encode(["user_id" => "$callback_from_id", "course" => intval($course_id)]);
    $data = createOrder($payload);
    $content = ['chat_id' => $callback_from_id, 'text' => $data];
    Answer($content);  
    
    $content = [
        'chat_id' => $callback_from_id, 
        'text' => "Siz benen tez arada baylanisamiz",
        'parse_mode' => "html",
    ];
    Answer($content);  
    $content = ['chat_id' => $callback_from_id, 'message_id'=>$callback_message_id];
    endpoint('deleteMessage', $content); 
}

           