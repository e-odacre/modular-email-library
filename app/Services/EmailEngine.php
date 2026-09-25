<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Process;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EmailEngine
{
    public function revision(): string
    {
        $hash = hash_init('sha256');
        $files = Finder::create()->files()->in(config('email.engine_path'))
            ->exclude(['node_modules', 'dist', '.git'])->sortByName();

        foreach ($files as $file) {
            hash_update($hash, $file->getRelativePathname());
            hash_update_file($hash, $file->getRealPath());
        }

        hash_update($hash, (string) config('email.node_binary'));

        return hash_final($hash);
    }

    public function request(array $request): array
    {
        $cache = Cache::store(config('email.cache_store'));
        $key = 'email:'.hash('sha256', $this->revision().json_encode($request, JSON_THROW_ON_ERROR));

        if (($cached = $cache->get($key)) !== null) {
            return $cached;
        }

        return $cache->lock($key.':lock', config('email.timeout') + 10)->block(
            config('email.timeout'),
            fn (): array => $cache->remember($key, 86400, fn (): array => $this->execute($request)),
        );
    }

    public function gallery(string $brand, string $artifact): string
    {
        $cache = Cache::store(config('email.cache_store'));

        return $cache->lock('email:gallery:'.$brand, config('email.timeout') + 10)->block(
            config('email.timeout'),
            function () use ($brand, $artifact, $cache): string {
                $revision = $this->revision();
                $key = 'email:gallery:'.$brand.':revision';
                $file = config('email.engine_path').'/dist/'.$brand.'/gallery/'.$artifact;
                if ($cache->get($key) !== $revision || ! is_file($file)) {
                    $this->execute(['operation' => 'gallery', 'brand' => $brand]);
                    $cache->put($key, $revision, 86400);
                }
                abort_unless(is_file($file), 404);

                return file_get_contents($file);
            },
        );
    }

    private function execute(array $request): array
    {
        try {
            $result = Process::path(config('email.engine_path'))
                ->timeout(config('email.timeout'))
                ->input(json_encode($request, JSON_THROW_ON_ERROR))
                ->run([config('email.node_binary'), 'scripts/bridge.js']);
        } catch (\Throwable $exception) {
            report($exception);
            throw new HttpException(503, 'Email rendering could not finish. Check the Node runtime and EMAIL_RENDER_TIMEOUT.', $exception);
        }
        $response = json_decode($result->output(), true);

        if (! is_array($response) || ! array_key_exists('ok', $response)) {
            report(new \RuntimeException('Email engine failed: '.$result->errorOutput()));
            throw new HttpException(503, 'Email engine unavailable. Check EMAIL_NODE_BINARY and run npm ci --prefix email-engine.');
        }
        if (! $response['ok']) {
            throw new HttpException($response['error']['status'], $response['error']['message']);
        }
        if (! $result->successful()) {
            throw new HttpException(503, 'Email engine exited unsuccessfully.');
        }

        return $response['data'];
    }
}
