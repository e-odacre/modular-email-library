<?php

return [
    'engine_path' => base_path('email-engine'),
    'node_binary' => env('EMAIL_NODE_BINARY', 'node'),
    'timeout' => (int) env('EMAIL_RENDER_TIMEOUT', 120),
    'cache_store' => env('EMAIL_CACHE_STORE', 'file'),
];
