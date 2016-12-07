importScripts('offline-google-analytics-import.js');
goog.offlineGoogleAnalytics.initialize();

importScripts('cache-polyfill.js');
var CACHE_NAME = '20160921';
var pkmImg = ["img/gif/001.gif","img/gif/002.gif","img/gif/003.gif","img/gif/004.gif","img/gif/005.gif","img/gif/006.gif","img/gif/007.gif","img/gif/008.gif","img/gif/009.gif","img/gif/010.gif","img/gif/011.gif","img/gif/012.gif","img/gif/013.gif","img/gif/014.gif","img/gif/015.gif","img/gif/016.gif","img/gif/017.gif","img/gif/018.gif","img/gif/019.gif","img/gif/020.gif","img/gif/021.gif","img/gif/022.gif","img/gif/023.gif","img/gif/024.gif","img/gif/025.gif","img/gif/026.gif","img/gif/027.gif","img/gif/028.gif","img/gif/029.gif","img/gif/030.gif","img/gif/031.gif","img/gif/032.gif","img/gif/033.gif","img/gif/034.gif","img/gif/035.gif","img/gif/036.gif","img/gif/037.gif","img/gif/038.gif","img/gif/039.gif","img/gif/040.gif","img/gif/041.gif","img/gif/042.gif","img/gif/043.gif","img/gif/044.gif","img/gif/045.gif","img/gif/046.gif","img/gif/047.gif","img/gif/048.gif","img/gif/049.gif","img/gif/050.gif","img/gif/051.gif","img/gif/052.gif","img/gif/053.gif","img/gif/054.gif","img/gif/055.gif","img/gif/056.gif","img/gif/057.gif","img/gif/058.gif","img/gif/059.gif","img/gif/060.gif","img/gif/061.gif","img/gif/062.gif","img/gif/063.gif","img/gif/064.gif","img/gif/065.gif","img/gif/066.gif","img/gif/067.gif","img/gif/068.gif","img/gif/069.gif","img/gif/070.gif","img/gif/071.gif","img/gif/072.gif","img/gif/073.gif","img/gif/074.gif","img/gif/075.gif","img/gif/076.gif","img/gif/077.gif","img/gif/078.gif","img/gif/079.gif","img/gif/080.gif","img/gif/081.gif","img/gif/082.gif","img/gif/083.gif","img/gif/084.gif","img/gif/085.gif","img/gif/086.gif","img/gif/087.gif","img/gif/088.gif","img/gif/089.gif","img/gif/090.gif","img/gif/091.gif","img/gif/092.gif","img/gif/093.gif","img/gif/094.gif","img/gif/095.gif","img/gif/096.gif","img/gif/097.gif","img/gif/098.gif","img/gif/099.gif","img/gif/100.gif","img/gif/101.gif","img/gif/102.gif","img/gif/103.gif","img/gif/104.gif","img/gif/105.gif","img/gif/106.gif","img/gif/107.gif","img/gif/108.gif","img/gif/109.gif","img/gif/110.gif","img/gif/111.gif","img/gif/112.gif","img/gif/113.gif","img/gif/114.gif","img/gif/115.gif","img/gif/116.gif","img/gif/117.gif","img/gif/118.gif","img/gif/119.gif","img/gif/120.gif","img/gif/121.gif","img/gif/122.gif","img/gif/123.gif","img/gif/124.gif","img/gif/125.gif","img/gif/126.gif","img/gif/127.gif","img/gif/128.gif","img/gif/129.gif","img/gif/130.gif","img/gif/131.gif","img/gif/132.gif","img/gif/133.gif","img/gif/134.gif","img/gif/135.gif","img/gif/136.gif","img/gif/137.gif","img/gif/138.gif","img/gif/139.gif","img/gif/140.gif","img/gif/141.gif","img/gif/142.gif","img/gif/143.gif","img/gif/144.gif","img/gif/145.gif","img/gif/146.gif","img/gif/147.gif","img/gif/148.gif","img/gif/149.gif","img/gif/150.gif","img/gif/151.gif"];
var type = 'img/type/bug.png img/type/dark.png img/type/dragon.png img/type/electric.png img/type/fairy.png img/type/fighting.png img/type/fire.png img/type/flying.png img/type/ghost.png img/type/grass.png img/type/ground.png img/type/ice.png img/type/normal.png img/type/poison.png img/type/psychic.png img/type/rock.png img/type/steel.png img/type/water.png'.split(' ');
var file = [
    'manifest.json',
    'css/font.css',
    'css/app.css',
    'js/app.js',
    'index.html',
    'img/cd.svg',
    'img/cd2.svg',
    'img/egg.png',
    'img/fb.svg',
    'img/glass.png',
    'img/filter.svg',
    'img/filter2.svg',
    'img/trophy.svg',
    'img/homeScreenIcon.png',
    'img/link.svg',
    'img/location.png',
    'img/Pokeball_icon.png',
    'img/pokedex.png',
    'img/settings.svg',
    'img/settings2.svg',
    'img/shareImg.jpg',
    'img/twitter.svg',
    'img/wtsapp.svg',
    'img/download.svg'

];

var urlsToCache = file.concat(pkmImg);
    urlsToCache = urlsToCache.concat(type)


self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );

});

self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {

          if (cacheName != CACHE_NAME && cacheName != 'offline-google-analytics' ) {
            console.log('clear_' + cacheName)
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
