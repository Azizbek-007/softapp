<?php 
$token = "5766145710:AAHTnL7XRDYbSrvlvX0F2z--QpN45Rlia8E";

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



$efede = json_decode(file_get_contents('php://input'), true);

$text = $efede["message"]["text"];
$chat_id = $efede["message"]["chat"]["id"];



if ($text == '/start') {

    $content = ['chat_id' => $chat_id, 'text' => "Assalawma aleykum $ufname $uname.", 'parse_mode' => 'markdown'];
    Answer($content);
}

     