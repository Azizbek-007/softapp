<?php
ob_start();
$token = "5943068483:AAEzNtXNsLjCU5ef8vQwWLE5SyLZaTaL0JI"; 
define("API_KEY",$token);

echo file_get_contents("https://api.telegram.org/bot" . API_KEY . "/setwebhook?url=" . $_SERVER['SERVER_NAME'] . "" . $_SERVER['SCRIPT_NAME']);

function bot($method,$datas=[]){
$http_build = http_build_query($datas);
$url = "https://api.telegram.org/bot".API_KEY."/".$method."?$http_build";
$http_build = file_get_contents($url);
return json_decode($http_build);
}

$update = json_decode(file_get_contents('php://input'));
$message = $update->message;
$user_id = $message->from->id;
$text = $message->text;

if(mb_stripos($text,"/start") !== false){
    bot('sendMessage',[
        'chat_id'=>$user_id,
        'text'=>" Assalomu alaykum xurmatli foydalanuvchi!",
        'parse_mode'=>"markdown",
        // 'reply_markup'=>json_encode([
        //     'inline_keyboard'=>[
        //         [['text'=>'Ishga tushirish' ,'callback_data'=>"BeroStart"]],
        //     ]
        // ])
    ]);
}
