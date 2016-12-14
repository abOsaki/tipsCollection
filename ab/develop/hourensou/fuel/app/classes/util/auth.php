<?php

class Util_Auth
{

    const STRETCH_COUNT = 1000;

    private function __construct()
    {}

    /**
     * ログインチェック
     */
    private static function check()
    {
        Log::info('check');
    }

    // 文字列からSHA256のハッシュ値を取得
    private static function get_sha256($target)
    {
        return hash("sha256", $target);
    }

    public static function get_stretched_password($password, $userId)
    {
        $salt = self::get_sha256($userId);
        $hash = "";
        for ($i = 0; $i < self::STRETCH_COUNT; $i ++) {
            $hash = self::get_sha256($hash . $salt . $password);
        }
        return $hash;
    }
}
