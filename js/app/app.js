if( typeof lastUpdate == "undefined" ){
  
  var lastUpdate = localStorage.getItem('lastUpdate');
  
}

var app = new Vue({

  el: 'body',

  data: {
    
    update : false,
    queryUpdate : false,
    p: p,
    m: m,
    t: t,
    language : (window.location.href.indexOf('tw') == -1) ? 'hk' : 'tw',
    ww: document.body.clientWidth,
    wh: window.innerHeight,
    sh: screen.height,
    pmDetail: null,
    ShowPmDetail: false,
    moves: false,
    // addToHomeScreen: false,
    bodyOverFlow: 'visible',
    textArr: ['From', 'To'],
    menu: false,
    filter: false,
    setting: false,
    newDate: new Date(),
    share: false,
    tips : false,
    pulling: false,
    filters: JSON.parse(localStorage.getItem('filter')) || {
      name: '',
      id: '',
      rank: 'id',
      egg: '',
      buddy: '',
      match: false,
      reverse: false,
      order: -1,
      type: '',
      select: 'clear',
    },
    abilityNameConvert: {
      'id': 'NO.',
      'Max CP': 'CP',
      'BaseStamina': 'STA',
      'BaseAttack': 'ATK',
      'BaseDefense': 'DEF',
    },
    modal: false,
    selfLink: localStorage.getItem('selfLink') || '',
    self2Link: localStorage.getItem('self2Link') || '',
    selfLinkInput: '',
    selfBtnSelected: '',
    moveSelected: '',
    moveSelectedCache: '',
    pkmCanLearnZIndex: '1',
    movefilter: false,
    moveFilterInput: '',
    closeBtnDisplay: 'visible',
    settingConfig: {},
    hiddenSetting: ['update', 'collapse'],
    sortMovesConfig: {
      rank: 'en',
      order: 1
    },
    combinationTime : 60,
    rank : false,
    showDefTDO : false,
    noOfRankPkmShow : 20,
    

  },

  computed: {


    w: function () {
      return (this.ww * 0.96 - 80);
    },

    stats: function () {

      var results = [];

      results.push([
        {
          label: 'A',
          value: this.p[this.pmDetail].BaseAttack / 3
        },
        {
          label: 'D',
          value: this.p[this.pmDetail].BaseDefense / 3
        },
        {
          label: 'S',
          value: this.p[this.pmDetail].BaseStamina / 5
        }
      ])

      return results

    },

    points: function () {

      var results = []

      this.stats.forEach(function (v, k) {
            var total = v.length

        results.push(v.map(function (stat, i) {
          var point = valueToPoint(stat.value, i, total)
          return point.x + ',' + point.y
        }).join(' '))

      })

      return results

    },

    bgRatio: function () {
      return Math.min(120, this.ww * 0.32) / 120
    },

    halfCircleHeight: function () {
      return 130 / 320 * Math.min( 480 , this.ww ) * 0.96
    },

    evalutionId: function () {

      var result = [false, false];

        var d = this.p[this.pmDetail].evalution; 
        if (d.length > 0) {
          d.forEach(function (v1, k1) { 
            v1.pm.forEach(function (v2, k2) {
              if (v2 == app.pmDetail + 1) {
                
                if (d[k1 - 1]) result[0] = { id : d[k1 - 1].pm , candy : d[k1 - 1].candy };
                if (d[k1 + 1]) result[1] = { id : d[k1 + 1].pm , candy : d[k1].candy };
              

              }
            })
          });
        }

      return result

    },

    prevPmDetail: function () {
      if (this.pmDetail !== null) return (this.pmDetail - 1 >= 0) ? this.pmDetail - 1 : 150
      return this.pmDetail
    },

    nextPmDetail: function () {
      if (this.pmDetail !== null) return (this.pmDetail + 1 < 151) ? this.pmDetail + 1 : 0
      return this.pmDetail
    },

    mainPmDetail: function () {
      return [this.prevPmDetail, this.pmDetail, this.nextPmDetail]
    },

    order: function () {
      return (this.filters.reverse) ? 1 : -1
    },
    
    lang : function(){
      return this.settingConfig['Ohter']['Language:select'].default;
    },
    
    hidePmBg : function(){
      
      return this.ShowPmDetail || this.menu || this.setting || this.filter || this.moves || this.rank
      
    }

  },

  methods: {

    init: function () {

      var _this = this;
      
      _this.$set( 'lastUpdateText', lastUpdate.substring(0,4) + ' / ' + lastUpdate.substring(4,6) + ' / ' + lastUpdate.substring(6,8)  )
      _this.checkSettingConfig();
      
      touchEvent( $('.container > .pkmBall')[0] );
      touchEvent( $('.outer.moves .close')[0] );
      customLinkListener( $('.self.btn')[0] );
      customLinkListener( $('.self2.btn')[0] );
      
      // if( _this.ww >= 541 ){
        
        // var _closeInfo = function(event){
        //   // alert(e)
        //   if( event.target.className.indexOf('ofScroll') !== -1 ){
        //     app.closeInfo();
        //   }
        // }
        
        // $('.info .ofScroll')[0].addEventListener("click",_closeInfo)
        // $('.info .ofScroll')[0].addEventListener("touchend",function(e){
        //   if( event.target.className.indexOf('ofScroll') !== -1 ){
        //     app.closeInfo();
        //   }
        // })
        
        
      // }
  
      window.onresize = function () {
        _this.ww = document.body.clientWidth;
        _this.wh = window.innerHeight;
        _this.sh = screen.height;
      }

      if ('serviceWorker' in navigator) {

        _this.settingConfig.Cache['Support:normal'] = 'Yes'

        if (!_this.settingConfig.Cache['Disable:check']) {
          
          var sw = window.location.href.indexOf('app.html') == -1 ? 'sw.js' : 'sw2.js'
          
          navigator.serviceWorker.register(sw).then(function (registration) {
            console.log('ServiceWorker registration successful');
            _this.settingConfig.Cache['Status:normal'] = 'Success';
            localStorage.setItem('settingConfig',JSON.stringify(_this.settingConfig));
          }).catch(function (err) {
            _this.settingConfig.Cache['Status:normal'] = 'Fail';
            localStorage.setItem('settingConfig',JSON.stringify(_this.settingConfig));
          });

        }

      }
      else {
        _this.settingConfig.Cache['Support:normal'] = 'No'
      }

      
    },

    getImgPath: function (id) {

      if (id == undefined || isNaN(id)) return 'https://placeholdit.imgix.net/~text?txtsize=10&w=80&h=80';
      var sex = '29 30 31 115 124 113'.split(' ').indexOf(id.toString()) == -1 ? 'm1' : 'f1';
      // return 'img/pkm/' + digitPad(0, id, 3) + '.png'
      return 'img/gif/' + digitPad(0, id, 3) + '.gif'

    },

    moreInfo: function (v) {

      if (this.moveSelected !== '') {
        this.moveSelectedCache = this.moveSelected;
        this.moveSelected = ''
      }
      this.ShowPmDetail = true;
      this.pmDetail = v;
      this.bodyOverFlow = 'hidden';

      $('.info .ofScroll')[0].scrollTop = 0;
      // setTimeout(function () {
      //   app.$set('contentHeight', $('.info .contentHeight .content:nth-child(2)')[0].clientHeight + 'px')
      // }, 100)


    },

    closeInfo: function (e) {
      
      if( e ){
        if( e.target.className.indexOf("ofScroll") == -1 ){
          return false;
        }
      }

      if (this.moveSelectedCache !== '') this.moveSelected = this.moveSelectedCache
      this.ShowPmDetail = false;
      this.bodyOverFlow = 'visible'

      setTimeout(function () {
        $('.info .ofScroll')[0].scrollTop = 0;
      }, 400)

    },

    showMenu: function () {

      // console.log("HI")
      this.menu = true;
      this.bodyOverFlow = 'hidden'

    },

    hideMenu: function () {

      this.menu = false
      this.bodyOverFlow = 'visible'
      this.shareEffect(false)

    },

    menuBtnEvent: function (type) {
      
      
      
      if (this.share) {
        
        try {
          ga('send', 'event', 'share_' + gaMapping.share[type], 'click');
        }catch(e){
          
        }

        if (type == 'share') this.shareEffect(false)
        else this.shareTo(type)

      }
      else {
        
        try {
          ga('send', 'event', 'menuBtn_' + gaMapping.menu[type], 'click');
        }catch(e){
          
        }

        if (type == 'p') this.rank = true
        else if (type == 'f') this.showFilter()
        else if (type == 'a') this.showMoves()
        else if (type == 'self') this.customUrlEvent('self')
        else if (type == 'self2') this.customUrlEvent('self2')

        if (type == 'share') this.shareEffect(true)
        else if( !/self/.test(type) ) this.hideMenu()

      }

    },

    showSetting: function () {
      this.setting = true
      this.bodyOverFlow = 'hidden'
      this.hideMenu();
    },

    hideSetting: function () {

      this.setting = false
      this.bodyOverFlow = 'visible'

    },

    // getRand: function (min, max) {
    //   return anime.random(min, max)
    // },

    shareEffect: function (t) {

      var btn = $('.outer.menu .btn > .cell')

      for (var i = 0; i < btn.length; i++) {
        
        if( btn[i].parentElement.className.indexOf('closeMenu') == -1 ){
          if (t) btn[i].classList.add('rotateY');
          else btn[i].classList.remove('rotateY');
        }
        
        if (i == btn.length - 1) {
          this.share = t;
        }
        
      }


    },

    shareTo: function (type) {

      var url = window.location.href + '?' + this.lang,
          title = 'Poké Guide',
          link = '';

      if (type == "f") link = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
    	else if( type == "self" ) link = 'http://twitter.com/home?status=' + encodeURIComponent(title) + ' ' + encodeURIComponent(url)
      else if (type == "self2") link = 'http://line.naver.jp/R/msg/text/?' + encodeURIComponent(title + '\n' + url);
      else if (type == 'a') {
        link = 'whatsapp://send?text=' + encodeURIComponent(title) + ' ' + encodeURIComponent(url)
      }else if( type == 'p' ) link = "http://goo.gl/VuWKny";

      window.open(link, '_blank');

    },

    showFilter: function () {

      this.filter = true
      this.bodyOverFlow = 'hidden'

    },

    hideFilter: function () {
      this.filter = false
      this.bodyOverFlow = 'visible'
      document.body.scrollTop = 0
    },

    clearFilter: function () {
      this.filters = {
        name: '',
        id: '',
        rank: 'id',
        egg: '',
        buddy : '',
        match: false,
        reverse: false,
        order: -1,
        type: '',
        select: 'clear',
      }
    },

    filterPkm: function (id) {

      var _id = Number(id) - 1,
        pkm = this.p[_id],
        f = this.filters,
        m = f.match,
        n = new RegExp(f.name.trim().split(' ').join('|'), 'gi'),
        t = new RegExp(f.type.split(' ').join('|'), 'gi'),
        i = f.id.trim(),
        nC = (m && f.name.trim() == '') ? true : (n.test(pkm.en_name) || n.test(pkm[app.lang + '_name'])) && f.name.trim() != '',
        iC = (m && i == '') ? true : i.split(' ').indexOf(String(id)) !== -1 && i !== '',
        tC = (m && f.type == '') ? true : (t.test(pkm.Type1) || t.test(pkm.Type2)) && f.type != '',
        eC = (m && f.egg == '') ? true : f.egg == pkm.egg && f.egg != '',
        bC = (m && f.buddy == '') ? true : f.buddy == pkm.buddy.km && f.buddy != '',
        result = false;


      if (f.name.trim() == '' && i == '' && f.type == '' && f.egg == '' && f.buddy == '') return true;

      if (m) {
        result = nC && iC && tC && eC && bC
      }
      else {
        result = nC || iC || tC || eC || bC
      }

      if (f.reverse) result = !result;

      return result;

    },

    saveFilter: function () {
      localStorage.setItem('filter', JSON.stringify(app.filters));
      this.hideFilter();
    },
    
    showRank : function(){
      this.rank = true
    },

    sort: function (a, b) {

      var type = this.filters.rank;

      return b[type] - a[type]

    },

    sortMoves: function (a, b) {

      var type = this.sortMovesConfig.rank,
          az = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
          _type = "normal fire water electric grass ice fighting poison ground flying psychic bug rock ghost dragon dark steel fairy".split(' ');

      a = a.$value;
      b = b.$value;

      if ( type == 'type' ) {

        var rs = _type.indexOf(a[type]) - _type.indexOf(b[type]);
        if (rs == 0) {
          return az.indexOf(a[type][0].toUpperCase()) - az.indexOf(b[type][0].toUpperCase())
        }

        return rs

      }
      else if (type == 'crit') {
        var _rs = a[type].replace('%', '') - b[type].replace('%', '');
        if (_rs == 0) {
          var rs_ = az.indexOf(a['en'][0]) - az.indexOf(b['en'][0]);
          if (rs_ == 0) {
            return az.indexOf(a['en'][1]) - az.indexOf(b['en'][1])
          }

          return rs_;
        }

        return _rs
      }

      return a[type] - b[type]

    },

    customUrlEvent: function (t, s, c) {

      this.selfBtnSelected = t || this.selfBtnSelected
      var targetLink = this[this.selfBtnSelected + 'Link'];

      if (s) {

        localStorage.setItem(this.selfBtnSelected + 'Link', this.selfLinkInput);
        this[this.selfBtnSelected + 'Link'] = this.selfLinkInput
        this.modal = false;
        
      }
      else if (targetLink == undefined) {

        return;

      }
      else if (targetLink != '' && !c) {

        window.location = targetLink;

      }
      else {

        this.modal = true;

        this.selfLinkInput = targetLink

      }

    },

    showMoves: function () {

      this.bodyOverFlow = 'hidden'
      this.moves = true;

    },

    hideMoves: function () {
      
      if( this.moveSelected ) {
        this.moveSelected = '';
        this.moveSelectedCache = '';
      }else if (this.movefilter) {

        this.movefilter = false;

      }
      else if (this.moveSelected == '') {
        this.bodyOverFlow = 'visible'
        this.moves = false;
        document.body.scrollTop = 0
      }


    },

    selectOnChange: function () {

      var value = $('#filterTypeSelect')[0].value;
      if (value !== 'clear') {
        var gap = (this.filters.type.length > 0) ? ' ' : '';
        this.filters.type += gap + value;
      }
      else {
        this.filters.type = '';
      }
    },

    settingEvent: function (n, sn, sv) {

      if (n) {

        if (sn && /:check/.test(sn)) {
          this.settingConfig[n][sn] = !sv
        }

        if (n == 'Cache' && sn == 'Disable:check' && !sv) {
          this.unregister();
        }

        localStorage.setItem('settingConfig', JSON.stringify(this.settingConfig));

      }


    },

    pkmCanLearn: function (v, z) {

      this.moveSelected = v
      this.pkmCanLearnZIndex = z

    },

    filterMove: function (v) {

      var f = this.moveFilterInput,
        n = new RegExp(f.trim().split(' ').join('|'), 'gi'),
        nC = (f.trim() == '') ? true : n.test(v.en) || n.test(v.cn),
        type = this.t[f.toLowerCase()],
        moves = /m1|m2/gi.test(f),
        result = moves ? /m1/gi.test(f) && v.crit == 0 || /m2/gi.test(f) && v.crit != 0 : nC;

      if (type) {
        
        if (f.toLowerCase() == v.type) return true;
        
        return false;
        
      }

      if (/dps|-1|crit|power|eps|energy|duration/gi.test(f)) {

        if (/dps/gi.test(f)){
          if(/def|ddps/gi.test(f)){
            app.sortMovesConfig.rank = 'ddps';
          }else{
            app.sortMovesConfig.rank = 'adps';
          }
        }
        if (/power/gi.test(f)) app.sortMovesConfig.rank = 'power';
        if (/crit/gi.test(f)) app.sortMovesConfig.rank = 'crit';
        if (/energy/gi.test(f)) app.sortMovesConfig.rank = 'energy';
        if (/eps/gi.test(f)) app.sortMovesConfig.rank = 'eps';
        if (/duration/gi.test(f)) app.sortMovesConfig.rank = 'duration';
        
        if (!/-1/.test(f) && / 1/.test(f)) app.sortMovesConfig.order = 1
        else app.sortMovesConfig.order = -1

        return moves ? result : true;

      }else if (app) {
        app.sortMovesConfig.rank = 'type'
        app.sortMovesConfig.order = 1
      }


      return result;

    },

    showMoveFilter: function () {
      this.movefilter = true;
      setTimeout(function () {
        $('.movefilter input')[0].focus();
      }, 200)
    },

    hideMoveFilter: function () {
      this.movefilter = false;
      this.moveFilterInput = '';
      app.sortMovesConfig.order = 1
    },

    Link1: function () {
      this.customUrlEvent('self1')
    },

    Link2: function () {
      this.customUrlEvent('self2')
    },

    checkSettingConfig: function () {

      var _this = this;
      var defalutConfig = {
        'Pkm Info': {
          'Base Ability:check': true,
          'Moves:check': true,
          'Type Eff.:check': true,
          'Evalution:check': true,
          'Egg:check': true,
          'Buddy:check': true,
          'Move Color:check' : true,
          'Notice:check' : true,
        },
        'Swipe PokéBall': {
          'Disable:check': false,
          'Left:select': {
            'None': 'none',
            'Filter': 'showFilter',
            'Moves': 'showMoves',
            'Link1': 'Link1',
            'Link2': 'Link2',
            'Rank' : 'showRank',
            'default': 'showFilter',
          },
          'Right:select': {
            'None': 'none',
            'Filter': 'showFilter',
            'Moves': 'showMoves',
            'Link1': 'Link1',
            'Link2': 'Link2',
            'Rank' : 'showRank',
            'default': 'showMoves',
          },
        },
        'Cache': {
          'Support:normal': 'No',
          'Status:normal': 'No Cache',
          'Disable:check': false,
        },
        'update': lastUpdate,
        'collapse': {
          'pkmCtn': true,
        },
        'Ohter' : {
          'Language:select' : {
            'HK' : 'hk',
            'TW' : 'tw',
            'default': window.location.href.indexOf('tw') == -1 ? 'hk' : 'tw'
          }
        }
      }
      var config = JSON.parse(localStorage.getItem('settingConfig'));
      
      if (config) {
        
        if( config.Ohter ){
          
            if( config.Ohter['Langage:select']  ){
            
              config.Ohter['Language:select'] = config.Ohter['Langage:select'];
              delete config.Ohter['Langage:select'];  
            
            }else if( !config.Ohter['Language:select'] ){
              
              config.Ohter['Language:select'] =  {
                'HK' : 'hk',
                'TW' : 'tw',
                'default': 'tw'
              }
              
          }
        
        }

        if (config.update !== lastUpdate && config.update !== undefined) {
  
          for (var k in defalutConfig) {
            if (!config[k]) {
              config[k] = defalutConfig[k]
            }else{
              for(var k1 in defalutConfig[k]){
                if (!config[k][k1]) {
                  config[k][k1] = defalutConfig[k][k1]
                }
              }
            }
          }

        }
        
        config.update = defalutConfig.update
        _this.settingConfig = config
        localStorage.setItem('settingConfig',JSON.stringify(config))

      }
      else {

        _this.settingConfig = defalutConfig;


      }
      
      var _lastUpdate = localStorage.getItem('lastUpdate');
      if( _lastUpdate != null && _lastUpdate != lastUpdate){
        if( _this.settingConfig.Cache['Status:normal'] == 'Success' ) {
          app.$set('update',true);
          app.$set('updateInfoText',updateInfoText);
        }
      }else{
        localStorage.setItem('lastUpdate',lastUpdate);
      }


    },

    unregister: function () {

      var _this = this;;

      if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('sw.js').then(function (registration) {
          // registration worked
          registration.unregister().then(function (boolean) {
            if (boolean) {
              _this.settingConfig.Cache['Status:normal'] = 'No Cache';
              localStorage.setItem('settingConfig', JSON.stringify(_this.settingConfig));
            }
            console.log('unregister is successful')
          });
        }).catch(function (error) {
          console.log('Registration failed with ' + error);
        });

      };
    },

    collapse: function (t) {

      var m = this.settingConfig.collapse

      if (t == 'pkmCtn') {
        m.pkmCtn = !m.pkmCtn;

      }

      localStorage.setItem('settingConfig', JSON.stringify(this.settingConfig));

    },

    getSTAB: function (t , move, pkm) {

      var multiplier = new RegExp(pkm.Type1 + '|' + pkm.Type2, 'gi').test(move.type) ? 1.25 : 1

      if( t !== 'p' ){
        return Number((Number(move[t + 'dps']) * multiplier).toFixed(2));
      }else{
        return Number((Number(move.power) * multiplier).toFixed(2));
      }

    },
    
    getColor : function ( t ){
      
      if( this.settingConfig['Pkm Info']['Move Color:check'] ){
        return t
      }
      
      return ''
    },
    
    sortCombination : function(a,b){
      
      if( a.tdo ){
        return a.tdo - b.tdo
      }
       
      var t = this.showDefTDO ? 'dt' : 't';
      
      return a[t] - b[t];
      
    },
    
    getCombicDamage : function(){
      
      return this.showDefTDO ? dtdo : tdo;;
      
    },
    
    concat : function(moves){
      
      return moves[0].concat(moves[1])
      
    },
    
    tdoToPct : function(c){
      
      var res = this.showDefTDO ? c.tdo / 305 : c.tdo / 391
      return (res * 100).toFixed(1) + '%'
    
    },
    
    getMoveCombination : function( pkm , t ){
        
        pkm = pkm || this.p[this.pmDetail];
        t = t || this.combinationTime || 60;
        
        var _this = this,
            m1 = pkm.moves[0],
            m2 = pkm.moves[1],
            f,s,
            result = [],
            d = this.showDefTDO;
        
        for ( var i=0; i < m1.length; i++ ){
          f = _this.m[m1[i]]
          for ( var k=0; k<m2.length; k++ ){
            s = _this.m[m2[k]]
            
            var Fdur = d ? f.duration / 1000 + 2 : f.duration / 1000,
                Sdur = d ? s.duration / 1000 + 2 : s.duration / 1000 + 0.5,
                noOfFmove = 0,
                noOfSmove = 0,
                damage  = 0,
                check = d ? _this.getSTAB('d',f,pkm ) > _this.getSTAB('d',s,pkm ) : _this.getSTAB('a',f,pkm ) > _this.getSTAB('a',s,pkm ),
                tdo = d ? pkm.combic[m1[i] +'/'+m2[k]].dtdo : pkm.combic[m1[i] +'/'+m2[k]].tdo;
            
            if ( check ){
              
              noOfFmove = Math.floor(t / Fdur);
              damage = _this.getSTAB('p',f,pkm ) * noOfFmove;
  
            }else{
              
              var Ereq = Math.ceil(s.energy * -1 / f.energy),
                  spc = Ereq * Fdur + Sdur
                  
              noOfSmove = Math.floor(t / spc),
              noOfFmove = Math.floor((t - Sdur * noOfSmove ) / Fdur),
              damage = noOfFmove * _this.getSTAB('p',f,pkm ) + noOfSmove * _this.getSTAB('p',s,pkm );
                  
            }
            
            result.push({
              m1 : m1[i],
              m2 : m2[k],
              t1 : noOfFmove,
              t2 : noOfSmove,
              damage : damage,
              tdo : tdo,
              id : pkm.id
            })
            
          }
          
        } 
        
        return result;
  
      },
      
    updateData : function(){
      
      this.unregister();
      
      localStorage.setItem('lastUpdate',lastUpdate);
      
      window.location.reload()
      
    }
    
  }

});

var gaMapping = {
  menu : {
    p : 'rank',
    f : 'filter',
    a : 'moves',
    self : 'customLink_1',
    self2 : 'customLink_2',
    share : 'more'
  },
  share : {
    p : 'fan_page',
    f : 'facebook',
    a : 'whatsapp',
    self : 'twitter',
    self2 : 'line',
    share : 'back'
  }
}
  
var setHeight = function( img , evalution ){
  
  var parent = img.parentElement;
  
  if( !evalution ){
    img.style.width = img.naturalWidth * 1.5 + 'px';
    parent.style.backgroundSize =  img.naturalWidth * 1.5 + 'px';
  }else{
    parent.style.height = img.naturalHeight + 'px'
  }
  
  parent.style.backgroundImage = 'url('+ img.src +')';
  
}

var touch = false,
    tempX, tempY, swipe, pull,
    t = $('.outer > .cell')[0],
    diffX, diffY,
    leftSwipe, rightSwipe, swipeFilter;

var touchEvent = function(el){
    
    var start = function(e){
      touch = true;
      tempX = e.pageX || e.touches[0].pageX
      tempY = e.pageY || e.touches[0].pageY
    }
    
    var move = function(e){
      
      
      
      if (touch) {
        
        

        diffX = e.pageX || e.touches[0].pageX;
        diffY = e.pageY || e.touches[0].pageY;
        
        diffX -= tempX
        diffY -= tempY

        tempX = e.pageX || e.touches[0].pageX;
        tempY = e.pageY || e.touches[0].pageY;
      
        var sc = app.settingConfig['Swipe PokéBall'],
        disabled = sc['Disable:check'];
        
        
        if (/pkmBall/gi.test(e.target.parentElement.parentElement.className + e.target.parentElement.className) && !disabled) {
         
          e.preventDefault()

          var ready = !leftSwipe && !rightSwipe;

          if (diffX < 0 && ready) {
            leftSwipe = true;
          }
          else if (diffX > 0 && ready) {
            rightSwipe = true;
          }
        }

        if (/close/gi.test(e.target.parentElement.className + e.target.className) && app.moveSelected == '') {
          if (Math.abs(diffX) > 0 || Math.abs(diffY) > 0) {
            swipeFilter = true;
          }
        }


      }
    }
    
    var end = function(e){
      
      var sc = app.settingConfig['Swipe PokéBall'],
      disabled = sc['Disable:check'];

      if (app.menu && /background/gi.test(e.target.className)) {
        app.hideMenu()
      } //close menu
      if (app.modal && /modal/gi.test(e.target.parentElement.className)) {
        app.modal = false
      } // close custom url config

      disabled = sc['Disable:check'];
      
      if (!disabled) {
        var _left = sc['Left:select']['default'],
          _right = sc['Right:select']['default'];

        if (leftSwipe && _left != 'none') app[_left]()
        if (rightSwipe && _right != 'none') app[_right]()
      }
      if (swipeFilter) {
        app.showMoveFilter()
      }

      touch = false;
      swipe = false;
      pull = false;
      leftSwipe = false;
      rightSwipe = false;
      swipeFilter = false;
      app.bodyOverFlow = 'visible'
    }
    
    el.addEventListener('touchstart', start );
    el.addEventListener('mousedown', start );
    
    el.addEventListener('touchmove', move );
    el.addEventListener('mousemove', move );
    
    el.addEventListener('touchend', end );
    window.addEventListener('mouseup', end );
  
}

var customLinkListener = function(el){
  
    el.addEventListener('contextmenu', function (e) {

      var el = e.target.parentElement.parentElement.parentElement.parentElement || e.target.parentElement.parentElement.parentElement;

      if (/self/gi.test(el.className)) {
        app.customUrlEvent(el.getAttribute('rel'), false, true)
      }

      if (/movesPkm/gi.test(e.target.parentElement.className)) {
        app.moreInfo(app.movesPkm - 1)
      }

      if (e.target.tagName !== 'INPUT') e.preventDefault();


    }, false);
}

window.onload = app.init;