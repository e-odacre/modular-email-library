<?php

use App\Http\Controllers\StudioController;
use Illuminate\Support\Facades\Route;
use Laravel\Boost\Middleware\InjectBoost;

Route::get('/', [StudioController::class, 'index'])->name('studio.home');
Route::get('/{library}', [StudioController::class, 'index'])
    ->whereIn('library', ['emails', 'recipes', 'components', 'brands'])->name('studio.library');
Route::get('/recipes/{id}', [StudioController::class, 'show'])
    ->defaults('kind', 'recipe')->where('id', '[a-z0-9-]+')->name('studio.recipe');
Route::get('/components/{id}', [StudioController::class, 'show'])
    ->defaults('kind', 'component')->where('id', '[a-z0-9-]+/[a-z0-9-]+')->name('studio.component');
Route::get('/{id}', [StudioController::class, 'show'])
    ->defaults('kind', 'email')->where('id', '(?:flows|campaigns|examples)/[a-zA-Z0-9_-]+')->name('studio.email');
Route::get('/frame/{kind}/{id}', [StudioController::class, 'frame'])
    ->whereIn('kind', ['email', 'recipe', 'component'])->where('id', '[a-zA-Z0-9_/-]+')
    ->withoutMiddleware(InjectBoost::class)->name('studio.frame');
Route::get('/studio/revision', [StudioController::class, 'revision'])->name('studio.revision');
Route::get('/studio/{asset}', [StudioController::class, 'asset'])->name('studio.asset');
Route::get('/brands/{brand}', fn (string $brand) => redirect('/brands/'.$brand.'/index.html'))
    ->where('brand', '[a-z0-9-]+')->name('studio.collection');
Route::get('/brands/{brand}/{artifact}', [StudioController::class, 'collection'])
    ->where('brand', '[a-z0-9-]+')->where('artifact', '.+')
    ->withoutMiddleware(InjectBoost::class)->name('studio.collection.artifact');

Route::get('test', [StudioController::class, 'test']);
