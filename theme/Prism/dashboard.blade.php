<!doctype html>
<html lang="zh-CN" data-skin="{{ $theme_config['skin'] ?? 'dark' }}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <meta name="theme-color" content="#070b14" />
  <title>{{$title}}</title>
  <link rel="stylesheet" href="/theme/{{$theme}}/assets/prism.css?v={{$version}}" />
  <script>
    window.settings = {
      title: @json($title),
      assets_path: '/theme/{{$theme}}/assets',
      version: @json($version),
      description: @json($description),
      logo: @json($logo),
      skin: @json($theme_config['skin'] ?? 'dark'),
      skin_switch: @json(($theme_config['skin_switch'] ?? '1') !== '0'),
      download_url: @json($theme_config['download_url'] ?? ''),
      background_url: @json($theme_config['background_url'] ?? '')
    };
    try { var s = localStorage.getItem('prism_skin'); if (s && window.settings.skin_switch) document.documentElement.dataset.skin = s; } catch (e) {}
  </script>
</head>
<body>
  <div class="bg"><i class="o1"></i><i class="o2"></i></div>
  <div id="app"></div>
  <script src="/theme/{{$theme}}/assets/qr.js?v={{$version}}"></script>
  <script src="/theme/{{$theme}}/assets/app.js?v={{$version}}"></script>
  {!! $theme_config['custom_html'] ?? '' !!}
</body>
</html>
