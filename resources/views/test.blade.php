<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>daisyUI Test</title>
    <!-- Ensure Vite is loading your CSS -->
    @vite('resources/css/app.css')
</head>
<body class="p-8 bg-base-200 min-h-screen flex flex-col items-center justify-center gap-4">

    <!-- 1. Test Button Component -->
    <button class="btn btn-primary">daisyUI Button</button>

    <!-- 2. Test Badge Component -->
    <div class="badge badge-secondary">Success Badge</div>

    <!-- 3. Test Card Component -->
    <div class="card bg-base-100 w-96 shadow-xl mt-4">
        <div class="card-body">
            <h2 class="card-title">Is it working?</h2>
            <p>If this card has rounded corners, a shadow, and clean typography, daisyUI is fully active!</p>
        </div>
    </div>

</body>
</html>
