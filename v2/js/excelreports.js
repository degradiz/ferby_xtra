


function inventario(proyecto){
    $.getJSON("https://dash.myferby.com/salco/api/endpoint.php?action=inventarios&id_constructora=7&proyecto=" + proyecto + "&tipo=1", {
                  
        }, function (json) {
                   buildData(json,"inventarios")
                })
        }



function construirTable(proyecto){
    $.getJSON("https://dash.myferby.com/salco/reportviewer/mainreport.php?proyecto=" + proyecto, {
                  
        }, function (json) {
            var html = "";
                   for (var i = 0; i < json.length ; i++){
                    html += "<tr>"
                        html += "<td>" + json[i].identificador + "</td>" + "<td>" + json[i].materiales_consumido + "</td>" + "<td>" + json[i].materiales_proyectado + "</td>" +"<td>" + json[i].diferencia_materiales + "</td>" +"<td>" + json[i].mod_consumido + "</td>" +"<td>" + json[i].mod_proyectado + "</td>" +"<td>" + json[i].diferencia_mod + "</td>" +"<td>" + json[i].contratista_consumido+ "</td>" +"<td>" + json[i].contratista_proyectado+ "</td>" +"<td>" + json[i].diferencia_contratistas+ "</td>";
                    html += "</tr>"
                   }
                   $("#trbdy").append(html);
                   $("#displayme").show("slow");
                }

                )
        }


function todoc(proyecto){
    $.getJSON("https://dash.myferby.com/salco/api/endpoint.php?action=todaslasordenesdecompra&proyecto=" + proyecto, {
                  
        }, function (json) {
                   buildData(json,"todasordenesdecompra")
                })
        }


function resumenGerencial(proyecto){
    $.getJSON("https://dash.myferby.com/salco/reportviewer/mainreport.php?proyecto=" + proyecto, {
                  
        }, function (json) {
                   buildData(json,"todasordenesdecompra")
                })
        }

function costos_centro_costo(proyecto){
    $.getJSON("https://dash.myferby.com/salco/api/endpoint.php?action=costo_centro_costo&proyecto=" + proyecto, {
                  
        }, function (json) {
                   buildData(json,"centro_costo_consumido")
                })
        }

function costos_centro_pryectado(proyecto){
    $.getJSON("https://dash.myferby.com/salco/api/endpoint.php?action=costos_centro_costo_proyectado&proyecto=" + proyecto, {
                  
        }, function (json) {
                   buildData(json,"centro_costo_proyectado")
                })
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