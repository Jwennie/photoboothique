<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Credentials
    |--------------------------------------------------------------------------
    |
    | Get these 3 values from your Cloudinary dashboard:
    |   https://cloudinary.com  ->  sign up free  ->  Dashboard
    |
    | Then add them to your .env file:
    |   CLOUDINARY_CLOUD_NAME=your-cloud-name
    |   CLOUDINARY_API_KEY=123456789012345
    |   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key'    => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),

];