<?php

require __DIR__ . '/../vendor/autoload.php';

use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\MarkdownConverter;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use Symfony\Component\Yaml\Yaml;

const REPO     = 'https://github.com/xtompie/saradom/blob/main/';
const BASE_URL = 'https://xtompie.github.io/saradom/';
const SITE     = 'Saradom';
const DESC     = 'Build modular, scalable frontends in plain HTML and JavaScript. No framework, no npm, no build step.';

$ROOT = dirname(__DIR__);
$OUT  = "$ROOT/docs";
$NAV  = require "$ROOT/content/nav.php";
$MD   = make_md();

rmrf($OUT);
@mkdir($OUT, 0777, true);

foreach (array_merge(["$ROOT/index.md"], glob("$ROOT/content/*.md")) as $file) {
    [$fm, $md] = frontmatter(file_get_contents($file));
    $name = pathinfo($file, PATHINFO_FILENAME);           // file name is the URL
    $body = includes($MD->convert($md)->getContent(), $ROOT);
    file_put_contents("$OUT/$name.html", page($fm, $body, "$name.html", $NAV));
}

copy_into("$ROOT/assets", $OUT);
echo "built → docs/\n";

// Run the layout template against a page's variables and capture its output.
function page(array $fm, string $body, string $current, array $nav): string
{
    $title   = $fm['title'] ?? SITE;
    $desc    = $fm['description'] ?? DESC;
    $landing = ($fm['layout'] ?? '') === 'landing';
    $next    = nav_next($nav, $current);
    // Per-page stylesheet, by convention: a page named foo (foo.html) loads assets/foo.css
    // if it exists — same name as the page, no front-matter needed. Extra shared sheets can
    // still be listed under `css:` in front matter.
    $name = pathinfo($current, PATHINFO_FILENAME);
    $css  = (array)($fm['css'] ?? []);
    if (is_file(dirname(__DIR__) . "/assets/$name.css")) $css[] = "$name.css";
    $css  = array_values(array_unique($css));
    ob_start();
    include __DIR__ . '/page.php';
    return ob_get_clean();
}

// Flatten the nav in order and return the entry after the current page, or null.
function nav_next(array $nav, string $current): ?array
{
    $flat = [];
    foreach ($nav as $items) {
        foreach ($items as [$title, $href]) $flat[] = ['title' => $title, 'href' => $href];
    }
    foreach ($flat as $i => $entry) {
        if ($entry['href'] === $current) return $flat[$i + 1] ?? null;
    }
    return null;
}

// Sidebar html from the nav.php array.
function nav_html(array $nav, string $current): string
{
    $out = '';
    foreach ($nav as $group => $items) {
        $out .= '<div class="nav-group">';
        if ($group !== '') $out .= '<div class="nav-title">' . htmlspecialchars($group) . '</div>';
        foreach ($items as [$title, $href]) {
            $active = $href === $current ? ' class="active"' : '';
            $out .= "<a$active href=\"" . htmlspecialchars($href) . '">' . htmlspecialchars($title) . '</a>';
        }
        $out .= '</div>';
    }
    return $out;
}

// Resolve the directive comments left untouched by the markdown pass. Each does one job.
//   Show, inert:
//     <!-- code:   path      --> → the file as a highlighted code block (language from extension)
//     <!-- source: path      --> → one link to the file's source
//     <!-- uses:   a b c     --> → one line of links to the files the reader must add
//   Embed, takes effect (chosen by extension), nothing shown as code:
//     <!-- embed:  path      --> → .js wrapped in <script> (runs), .css in <style> (applies), else raw (renders live)
//   Demo, one block: the file rendered live above its own highlighted source:
//     <!-- demo:   path      --> → a preview box + the file's code, joined into one card
// include:/include-html/include-js/include-css are legacy aliases, kept so unmigrated pages keep working.
function includes(string $html, string $root): string
{
    $html = preg_replace_callback('/<!--\s*demo:\s*(\S+)\s*-->/',  fn($m) => demo_file($m[1], $root), $html);
    $html = preg_replace_callback('/<!--\s*embed:\s*(\S+)\s*-->/', fn($m) => embed_file($m[1], $root), $html);
    $html = preg_replace_callback('/<!--\s*code:\s*(\S+)\s*-->/',  fn($m) => include_code($m[1], $root), $html);
    $html = preg_replace_callback('/<!--\s*uses:\s*(.+?)\s*-->/',  fn($m) => uses_block(preg_split('/\s+/', trim($m[1]))), $html);

    // legacy aliases
    $html = preg_replace_callback('/<!--\s*include-html:\s*(\S+)\s*-->/', fn($m) => raw_file($m[1], $root), $html);
    $html = preg_replace_callback('/<!--\s*include-js:\s*(\S+)\s*-->/',   fn($m) => wrap_file($m[1], $root, 'script'), $html);
    $html = preg_replace_callback('/<!--\s*include-css:\s*(\S+)\s*-->/',  fn($m) => wrap_file($m[1], $root, 'style'), $html);
    $html = preg_replace_callback('/<!--\s*include:\s*(\S+)\s*-->/',      fn($m) => include_code($m[1], $root), $html);
    $html = preg_replace_callback('/<!--\s*source:\s*(\S+)\s*-->/',       fn($m) => source_link($m[1], $root), $html);
    return $html;
}

// demo: the file rendered live in a preview box, with its own source shown right below,
// joined into one card. One file is the single source for both the demo and the code.
function demo_file(string $path, string $root): string
{
    $path = ltrim($path, '/');
    if (!is_file("$root/$path")) return '<!-- demo not found: ' . htmlspecialchars($path) . ' -->';
    $raw = rtrim(file_get_contents("$root/$path"), "\n");
    return '<div class="demo">' . "\n" . $raw . "\n</div>\n" . highlight(ext_lang($path), $raw);
}

// embed: the file takes effect, chosen by extension. .js runs, .css applies, anything else pastes in raw.
function embed_file(string $path, string $root): string
{
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if ($ext === 'js')  return wrap_file($path, $root, 'script');
    if ($ext === 'css') return wrap_file($path, $root, 'style');
    return raw_file($path, $root);
}

// Raw file contents (rendered live). Wrapped file contents (runs / applies).
function raw_file(string $path, string $root): string
{
    $path = ltrim($path, '/');
    return is_file("$root/$path") ? file_get_contents("$root/$path") : '<!-- include-html not found: ' . htmlspecialchars($path) . ' -->';
}

function wrap_file(string $path, string $root, string $tag): string
{
    $path = ltrim($path, '/');
    if (!is_file("$root/$path")) return "<!-- include-$tag not found: " . htmlspecialchars($path) . ' -->';
    return "<$tag>\n" . rtrim(file_get_contents("$root/$path"), "\n") . "\n</$tag>";
}

function include_code(string $path, string $root): string
{
    $path = ltrim($path, '/');
    if (!is_file("$root/$path")) return '<pre><code class="hljs">// include not found: ' . htmlspecialchars($path) . '</code></pre>';
    return highlight(ext_lang($path), rtrim(file_get_contents("$root/$path"), "\n"));
}

// A line of links to each listed file's source, so the reader can open each one.
function uses_block(array $paths): string
{
    $links = [];
    foreach ($paths as $path) {
        $p = ltrim($path, '/');
        if ($p === '' || isset($links[$p])) continue;
        $href = preg_match('#^https?://#', $p) ? $p : REPO . $p;
        $links[$p] = '<a href="' . htmlspecialchars($href) . '" target="_blank" rel="noopener">' . htmlspecialchars(basename($p)) . '</a>';
    }
    return $links ? '<p class="code-src">Uses: ' . implode(', ', $links) . '</p>' : '';
}

function source_link(string $path, string $root): string
{
    $path = ltrim($path, '/');
    if (!is_file("$root/$path")) return '<p class="code-src">source not found: ' . htmlspecialchars($path) . '</p>';
    $name = basename($path);
    return '<p class="code-src">Source: <a href="' . htmlspecialchars(REPO . $path) . '" target="_blank" rel="noopener">' . htmlspecialchars($name) . '</a></p>';
}

// Highlight language from a file extension.
function ext_lang(string $path): string
{
    return ['js' => 'javascript', 'php' => 'php', 'html' => 'xml', 'css' => 'css', 'json' => 'json'][strtolower(pathinfo($path, PATHINFO_EXTENSION))] ?? '';
}

// Build-time syntax highlighting, shared by fenced blocks and includes.
function highlight(string $lang, string $code): string
{
    static $hl = null;
    $hl ??= new \Highlight\Highlighter();
    try {
        $r = $lang
            ? $hl->highlight($lang, $code)
            : $hl->highlightAuto($code, ['javascript', 'xml', 'css', 'json', 'php', 'bash']);
        return '<pre><code class="hljs language-' . $r->language . '">' . $r->value . '</code></pre>';
    } catch (\Throwable $e) {
        return '<pre><code class="hljs">' . htmlspecialchars($code, ENT_QUOTES) . '</code></pre>';
    }
}

// Markdown: CommonMark, headings get slug ids, fenced code gets highlighted.
function make_md(): MarkdownConverter
{
    $env = new Environment();
    $env->addExtension(new CommonMarkCoreExtension());
    $env->addRenderer(FencedCode::class, new class implements NodeRendererInterface {
        private array $map = ['js' => 'javascript', 'html' => 'xml', 'sh' => 'bash', 'shell' => 'bash'];
        public function render(Node $node, ChildNodeRendererInterface $c): string
        {
            if (!$node instanceof FencedCode) return '';
            $info = $node->getInfoWords()[0] ?? '';
            return highlight($this->map[$info] ?? $info, rtrim($node->getLiteral(), "\n"));
        }
    });
    $env->addRenderer(Heading::class, new class implements NodeRendererInterface {
        public function render(Node $node, ChildNodeRendererInterface $c): string
        {
            if (!$node instanceof Heading) return '';
            $l = $node->getLevel();
            $inner = $c->renderNodes($node->children());
            $slug = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower(html_entity_decode(strip_tags($inner), ENT_QUOTES))), '-');
            if ($slug === '') return "<h$l>$inner</h$l>";
            $s = htmlspecialchars($slug);
            return "<h$l id=\"$s\">$inner<a class=\"anchor\" href=\"#$s\" aria-hidden=\"true\">#</a></h$l>";
        }
    });
    return new MarkdownConverter($env);
}

// Split a "--- yaml ---" front matter block from the markdown body.
function frontmatter(string $raw): array
{
    if (preg_match('/^---\R(.*?)\R---\R?(.*)$/s', $raw, $m)) {
        return [Yaml::parse($m[1]) ?: [], $m[2]];
    }
    return [[], $raw];
}

function rmrf(string $p): void
{
    if (!file_exists($p)) return;
    if (!is_dir($p)) { @unlink($p); return; }
    foreach (scandir($p) as $f) if ($f !== '.' && $f !== '..') rmrf("$p/$f");
    @rmdir($p);
}

function copy_into(string $src, string $dst): void
{
    if (!is_dir($src)) return;
    @mkdir($dst, 0777, true);
    foreach (scandir($src) as $f) {
        if ($f === '.' || $f === '..') continue;
        is_dir("$src/$f") ? copy_into("$src/$f", "$dst/$f") : copy("$src/$f", "$dst/$f");
    }
}
