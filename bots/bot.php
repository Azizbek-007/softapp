
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


function SendRequest($url, $payload, $req) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://api.sales-up.uz/api/v1'.$url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => $req,
    CURLOPT_POSTFIELDS =>$payload,
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI',
        'Content-Type: application/json'
    ),
    ));

    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    return [$httpcode, json_decode($response, true)];
}


function courses_btn () {
    $courses = SendRequest("/course?take=100", '', 'GET');
    if ($courses[0] != 200) return false;

    $array = [];

    foreach ($courses[1]["data"] as $x) {
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

 

$menu = [["Kurslar"], ["About", "Murajat"]];
if ($text == '/test'){
    $content = [ 
        'chat_id' => $chat_id, 
        'text' => "Bot Working", 
        'parse_mode' => 'html',
    ];
    Answer($content);  
}

if (stripos($text, '/start') !== false) {
    unlink("$chat_id.$bot_id.txt");
    $text_spilt = explode(' ', $text); 
    if(Count($text_spilt) == 2){
        $payload = json_encode(["user_id" => "$chat_id",  "FIO" => "$first_name $last_name", "instrument" => $text_spilt[1] ]);
        $data = SendRequest('/lead', $payload, 'POST');
        SendRequest('instrument/:id', $payload, 'PATCH');
    }else{
        $payload = json_encode(["user_id" => "$chat_id",  "FIO" => "$first_name $last_name" ]); 
        $data = SendRequest('/lead', $payload, 'POST');
    }
 
    $check_phone = SendRequest('/lead/'.$chat_id, '', 'GET'); 
    if($check_phone[0] == 200) {
        if ($check_phone[1]["phone"] == "0"){
            $content = ['chat_id' => $chat_id, 'text' => "Assalawma aeykum telefon nomerin'izdi kiritin':", 'parse_mode' => 'markdown']; 
            Answer($content);
            @file_put_contents("$chat_id.$bot_id.txt", "phone");
            exit();
        }else{
            $content = [
                'chat_id' => $chat_id, 
                'text' => "Assaalawma aleykum",  
                'parse_mode' => 'markdown',
                'reply_markup' => buildKeyBoard($menu)
            ];
            Answer($content);  
        }
    }
}  

if (@file_get_contents("$chat_id.$bot_id.txt") == "phone") {
    if(preg_match('/^[\+]?(998)?([- (])?(90|91|93|94|95|98|99|33|97|71|75)([- )])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$/', "$text") != false) {
        $api_payload = json_encode(["user_id" => "$chat_id", "phone" => "$text", "status" => 0]);
        SendRequest('/lead/:id?', $api_payload, 'PATCH');
        $payload = ['chat_id' => $chat_id, 'text' => "menu", 'reply_markup' => buildKeyBoard($menu)];
        Answer($payload);
        unlink("$chat_id.$bot_id.txt");
    }else{
        $payload = ['chat_id' => $chat_id, 'text' => "Nomerdi qate kiritin'iz qayta kiritin':"];
        Answer($payload);
    }
} 

if ($text == $menu[0][0]){
    $course_btn = courses_btn();

    if ($course_btn == false) { 
        $content = [
            'chat_id' => $chat_id, 
            'text' => "Ha'zirde bizde kurslar joq", 
            'parse_mode' => 'markdown'
        ];
        Answer($content);
        exit();
    }
    $content = [
        'chat_id' => $chat_id, 
        'text' => "Ha'zirde bizde bar bolg'an kurslar", 
        'parse_mode' => 'markdown',
        'reply_markup' => $course_btn
    ];
    Answer($content);  
}

if ($text == 'About'){
    $data = SendRequest('/setting', '', 'GET')[1];
    $content = [ 
        'chat_id' => $chat_id, 
        'text' => $data["contact"]."\n\n©️ <b>SoftApp</b>", 
        'parse_mode' => 'html',
    ];
    Answer($content);  
}

if (@file_get_contents("$chat_id.$bot_id.txt") == "murajat") {
    if ($text == "Arqag'a") {
        unlink("$chat_id.$bot_id.txt");
        $payload = ['chat_id' => $chat_id, 'text' => "menu", 'reply_markup' => buildKeyBoard($menu)];
        Answer($payload);
        exit();
    }
    unlink("$chat_id.$bot_id.txt");
    $api_payload = json_encode(["question" => "$text", "user_id" => "$chat_id", "message_id" => "$message_id"]);
    $data = SendRequest('/support', $api_payload, 'POST');
    $payload = ['chat_id' => $chat_id, 'text' => "Tez arada juwap beremeiz $data[0]", 'reply_to_message_id' => $message_id, 'reply_markup' => buildKeyBoard($menu)];
    Answer($payload);
} 

if($text == "Murajat") {
    unlink("$chat_id.$bot_id.txt");
    file_put_contents("$chat_id.$bot_id.txt", "murajat");
    $content = [ 
        'chat_id' => $chat_id, 
        'text' => "Murajatin'izdi jazip qaldirin':", 
        'parse_mode' => 'html',
        'reply_markup' => buildKeyBoard([["Arqag'a"]])
    ];
    Answer($content);
}

if(stripos($callback_data, "CourseID=") !== false) {
    $course_id = explode('=', $callback_data)[1];
    SendRequest('/course/'.$course_id, '', 'PATCH');
    $course_information = SendRequest('/course/'.$course_id, '', 'GET')[1];
    $content = [
        'chat_id' => $callback_from_id, 
        'text' => "🔖<b>".$course_information["name"]."</b>\n".$course_information["description"],
        'parse_mode' => "html",
        'reply_markup' => json_encode([
            "inline_keyboard" => [
                [["text" => "Kursqa jaziliw", "callback_data" => "OKCourse=$course_id"]]
            ]
        ]),
    ];
    Answer($content);  
    $content = ['chat_id' => $callback_from_id, 'message_id'=>$callback_message_id];
    endpoint('deleteMessage', $content);
}

if(stripos($callback_data, "OKCourse=") !== false) {
    $course_id = explode('=', $callback_data)[1];
    $payload = json_encode(["user_id" => "$callback_from_id", "course" => intval($course_id)]);
    $data = SendRequest('/order', $payload, 'POST')[0];
    
    $content = [
        'chat_id' => $callback_from_id, 
        'text' => "Siz benen tez arada baylanisamiz",
        'parse_mode' => "html",
    ];
    Answer($content);  
    $content = ['chat_id' => $callback_from_id, 'message_id'=>$callback_message_id];
    endpoint('deleteMessage', $content); 
}