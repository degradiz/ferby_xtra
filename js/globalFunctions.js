function getServerPath() {
    //var serverPath = 'http://localhost/github/ferbyWeb/ws/wsMain.php';
    var serverPath = 'https://xtra.myferby.com/ws/wsMain.php';
    return serverPath;
}

function baseUrl(){
    //return 'http://localhost/github/ferbyWeb/';
    return 'https://xtra.myferby.com/';
}

function validateScope(scope){    
    scope.username = sessionStorage.username;
    scope.$on('$destroy', function () {
        if(scope.modal)
            scope.modal.remove();
        if(typeof myPopup.close === "function")
            myPopup.close();
    });
}

function imgPath(img){
    return baseUrl()+'img/'+img;
}   


function redirectPostOnNewTab(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    form.target= "_blank";
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

function postData(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

function finalPrint(table,name){
     var dt = new Date();
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    var hora = dt.getHours();
    var minutos = dt.getMinutes();
    var segundos = dt.getSeconds();
    var fechahora = (day + '-' + month + '-' + year + '  / ' + hora + ':' + minutos + ':' + segundos);
    var link = document.createElement('a');
    link.download = name + '.xls';
    link.href = 'data:application/vnd.ms-excel;charset=utf-8,' + '<table><tr><td>Fecha y Hora</td><td>' + fechahora + '</td></tr><tr></tr><tr><td>'+name+'</td></tr></table><br/>' + '<table>' + encodeURIComponent(table) + '</table>'
    link.click();
}


function buildData(json,name){ 
var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

 function buildHtmlTable(arr) {
  
     var table = _table_.cloneNode(false),
         columns = addAllColumnHeaders(arr, table);
     for (var i=0, maxi=arr.length; i < maxi; ++i) {
         var tr = _tr_.cloneNode(false);
         for (var j=0, maxj=columns.length; j < maxj ; ++j) {
             var td = _td_.cloneNode(false);
                 cellValue = arr[i][columns[j]];
             td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
             tr.appendChild(td);
         }
         table.appendChild(tr);
     }
     finalPrint($(table).html(),name)
 }
 
 // Adds a header row to the table and returns the set of columns.
 // Need to do union of keys from all records as some records may not contain
 // all records
 function addAllColumnHeaders(arr, table)
 {
     var columnSet = [],
         tr = _tr_.cloneNode(false);
     for (var i=0, l=arr.length; i < l; i++) {
         for (var key in arr[i]) {
             if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                 columnSet.push(key);
                 var th = _th_.cloneNode(false);
                 th.appendChild(document.createTextNode(key));
                 tr.appendChild(th);
             }
         }
     }
     table.appendChild(tr);
     return columnSet;
 }

 buildHtmlTable(json);
}
