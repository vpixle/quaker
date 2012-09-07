/* 
  jQuery Mobile Boilerplate
  application.js
*/
$(document).live("pageinit", function(event){
  //vypocet pozadovane koncentrace
  $("#conc_brix").on("change", function(e){
    var newConc = $("#conc_brix").val()*$("#brixfactor").val();
    newConc = roundNumber(newConc,2)
    $("#conc_percent").val(newConc);
  });
  
});

// Volani delete vymazu stroje ze site 
//'<a href="#" onclick="deleteSiteRecord(' + item['id'] + ');"></a>

function initDatabase() {
    if (typeof(db) !== 'undefined') {
      db.transaction(function(tx) {tx.executeSql('REINDEX QUAKERDB')});
      db.transaction(function(tx) {tx.executeSql('VACUUM')});
    } else { 
    var shortName = 'QUAKERDB';  
    var version = '1.0';  
    var displayName = 'QuakerApp Database';  
    var maxSize = 2000000; //  bytes  
    db = openDatabase(shortName, version, displayName, maxSize);  
    console.log("Database created");
    createTables();
  }
    var the_id = null;
    var query = null;  
    var item = null;
}  

/***
**** CREATE TABLE ** 
***/
function createTables(){
  db.transaction(
        function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS site_settings(id INTEGER PRIMARY KEY AUTOINCREMENT, machine_ref VARCHAR(40), brixfactor NUMERIC NOT NULL, machineloc VARCHAR(40), machinemake appearance VARCHAR(20), individual VARCHAR(20), sumpsize INTEGER, machineage NUMERIC, fluid VARCHAR(40), fluidmake VARCHAR(40), target_min NUMERIC, target_max NUMERIC, initialfill NUMERIC, water VARCHAR(20), watersrc VARCHAR(20), operation VARCHAR(20), material VARCHAR(20), emu_cooler VARCHAR(20), cooling VARCHAR(20), mixing VARCHAR(20), premix VARCHAR(40), filter VARCHAR(20), emu_temperature NUMERIC, emu_pressure NUMERIC, temperature NUMERIC, concentration NUMERIC)', [], nullDataHandler, errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS readings(id INTEGER PRIMARY KEY AUTOINCREMENT, machine_ref VARCHAR(40), machine_id INTEGER, date DATE, brixfactor NUMERIC NOT NULL, appearance VARCHAR(20), perform INTEGER, ph NUMERIC, conc_brix NUMERIC, conc_percent NUMERIC, product_added_liter INTEGER, water_added INTEGER, additive_added VARCHAR(40))', [], nullDataHandler, errorHandler);
          console.log("Tables created");
        }
    );
}

/* ADD SiteRrecord */ 
function newSiteRecord() {
  initDatabase();
  var machine_name = 'New Machine';
  var query ='INSERT INTO site_settings (machine_ref, brixfactor) VALUES (?,?)';
    db.transaction(function(tx) {
        tx.executeSql(query, [machine_name , 1], function(tx, result) {
          window.localStorage.setItem("the_id", result.insertId);  
          console.log("Record added");
      }, 
        errorHandler);
    });
  //showSiteRecords();
  $.mobile.changePage("../site-setup/machine-detail.html", 'fade', true, true);
}

// SELECT all site records and display them 
function showSiteRecords() {
  initDatabase();
  document.getElementById('siterecords').innerHTML = '<li data-role="list-divider">Please select a machine</li>';
  var query = 'SELECT * FROM site_settings'
  db.transaction(function(tx) {
        tx.executeSql( query, [], function(tx, result) {
            if (result.rows.length) {
        for (var i = 0, item = null; i < result.rows.length; i++) {
          item = result.rows.item(i);
          document.getElementById('siterecords').innerHTML +=
          '<li><a href="#" onclick="jump2machine(\x27' + item['id'] + '\x27);">' + item['machine_ref'] + '</a></li>';
          }
          $('#siterecords').listview('refresh', true);
            } else {
        document.getElementById('siterecords').innerHTML +='<li>No machine found</li>';
        $('#siterecords').listview('refresh', true);
      }
        });
    });
}

// SELECT all machines and display them 4 maintenance 
function mainteList() {
  initDatabase();
    document.getElementById('maintList').innerHTML = 
      '<li data-role="list-divider">Please select a machine</li>';
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM site_settings', [], function(tx, result) {
            if (result.rows.length) {
        for (var i = 0, item = null; i < result.rows.length; i++) {
          item = result.rows.item(i);
          document.getElementById('maintList').innerHTML +=
          '<li><a href="#" onclick="addReadings('+ item['id'] +',\x27' + item['machine_ref'] + '\x27,' + item['brixfactor'] + ');">' + item['machine_ref'] + '</a>'
          +'<a href="#" onclick="callHistory(' + item['id'] + ',\x27' + item['machine_ref'] + '\x27);"></a></li>';
        }
        $('#maintList').listview('refresh', true);
            } else {
        document.getElementById('maintList').innerHTML +='<li>No machine found</li>';
        $('#maintList').listview('refresh', true);
      }
    });
  });
}

// Add readings for a selected machine (id & brixfactor from settings)
function addReadings(id, machine, bx) {
  initDatabase();
    var datum = dateString(new Date(), '%Y-%N-%D');
    var query = 'SELECT * FROM readings WHERE machine_id ="' + id + '\" AND date="' + datum + '\"';
    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, result) {
            if (result.rows.length) {
                query = 'DELETE FROM readings WHERE machine_id ="' + id + '\" AND date="' + datum + '\"';
                db.transaction(function(tx) {
                    tx.executeSql(query, [], function(tx, result) {
                        console.log("Readings deleted");
                        nullDataHandler;
                    }, errorHandler);
                });
            }
            db.transaction(function(tx) {
               tx.executeSql('INSERT INTO readings (machine_id, machine_ref, date, brixfactor) VALUES (?,?,?,?)', [id, machine, datum, bx], function(tx, result) {
               console.log("Readings added");
               window.localStorage.setItem("the_id", result.insertId);
               $.mobile.changePage("http://quaker.vpixle.com/maintenance/readings.html", 'fade', true, true);
        }, errorHandler);
      });
        }, errorHandler);
    });
}

// Call History  (on key)
function callHistory(id, machine){
  initDatabase();
  window.localStorage.setItem("the_id", id);
  window.localStorage.setItem("machine", machine);
  $.mobile.changePage("http://quaker.vpixle.com/history/", 'fade', true, false);
}

// SELECT all history records and display them 
function historyList() {
    initDatabase();
    id = window.localStorage.getItem("the_id");
    machine = window.localStorage.getItem("machine"); 
    query = 'SELECT id, machine_id, date FROM readings WHERE machine_id="' + id + '" ORDER BY "date" ASC'; 
    document.getElementById('historyList').innerHTML = '<li data-role="list-divider">'+ machine +'</li>';
    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, result) {
            if (result.rows.length) {
        for (var i = 0, item = null; i < result.rows.length; i++) {
          item = result.rows.item(i);
          document.getElementById('historyList').innerHTML +=
          '<li><a href="#" onclick="getHistDetail(' + item['id'] + ');">' + item['date'] + '</a></li>';
        }
        $('#historyList').listview('refresh', true);
            } else {
      document.getElementById('historyList').innerHTML +='<li>No readings found</li>';
      $('#historyList').listview('refresh', true);
      }
        });
    });
}

// GET History Detail
function getHistDetail (id){
  initDatabase();
  query = 'SELECT * FROM readings WHERE id="' + id + '\"';
  window.localStorage.setItem("query", query); 
  $.mobile.changePage("http://quaker.vpixle.com/history/detail.html", 'fade', true, true);   
}

// Jump2machine
function jump2machine (id) {
    initDatabase();
  window.localStorage.setItem("the_id", id);
    $.mobile.changePage("http://quaker.vpixle.com/site-setup/machine-detail.html", 'fade', true, true);
}

// Delete Machine from Site 
function deleteSiteRecord(id) {
  db.transaction(function(tx) {
    tx.executeSql('DELETE FROM site_settings WHERE id=?', [id], function(tx, result) {
      showSiteRecords()
    }, errorHandler);
  });
}

//jump2graph();
function jump2graph() {
  $.mobile.changePage("graph.html", 'fade', true, true);
  //id = window.localStorage.getItem("the_id");
  //machine
}

// ErrorHandrer
function errorHandler(transaction, error){
  if (error.code==1){
      console.log("DB Table already exists");
      // DB Table already exists
    } else {
      // Error is a human-readable string.
      console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
    }
    return false;
}

/***
**** DELETE DB TABLE ** 
***/
function dropTables() {
    db.transaction(
    function(tx) {
        //tx.executeSql('DROP TABLE site_settings;', [], nullDataHandler, errorHandler);
        tx.executeSql('DROP TABLE readings;', [], nullDataHandler, errorHandler);
    });
    console.log("Tables have been dropped");
    initDatabase();
    for (var i = 1; i <= 31; i++) {
        var datum = '2012-08-' + i;
        var id = 1;
        var ph = Math.floor((Math.random() * 14));
        var brix = Math.floor((Math.random() * 30));
        var conc = Math.floor((Math.random() * 30) + 1);
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO readings (machine_id, machine_ref, date, ph, conc_brix, conc_percent) VALUES (?,?,?,?,?,?)', [id, 'Mazak', datum, ph, brix, conc], function(tx, result) {}, errorHandler);
        });
    }
}


function nullDataHandler(){
  //db = openDatabase("QUAKERDB", "1.0", "QuakerApp Database", 200000);
  //db.transaction(function(tx) {tx.executeSql('REINDEX site_settings')});
  //db.transaction(function(tx) {tx.executeSql('REINDEX readings')});
  //db.transaction(function(tx) {tx.executeSql('VACUUM')});
  console.log("Query Succeeded / Data refreshed");
} 

// Specify num of Zeroes 
function roundNumber(number,decimal_points) {
  if(!decimal_points) return Math.round(number);
  if(number == 0) {
    var decimals = "";
    for(var i=0;i<decimal_points;i++) decimals += "0";
    return "0."+decimals;
  }
  var exponent = Math.pow(10,decimal_points);
  var num = Math.round((number * exponent)).toString();
  return num.slice(0,-1*decimal_points) + "." + num.slice(-1*decimal_points)
} 

// Formating Date
function dateString(date,string) {
    /* key for creating string
      %Y = 2008
      %y = 08
      %M = January
      %m = Jan
      %N = 01 (month)
      %n = 1 (month)
      %W = Monday
      %w = Mon
      %D = 05 (day of month)
      %d = 5 (day of month)
      %O = ordinal like 'st' for 1st, or 'th' for 5th
      Example: '%W, the %d%O of %M, %Y' will return a string like
      'Tuesday, the 6th of February, 2009'
    */
    var months = ['January','February','March','April','May',
                  'June','July','August','September',
                  'October','November','December'];
    var days = ['Sunday','Monday','Tuesday','Wednesday',
                'Thursday','Friday','Saturday'];
    var day=date.getDay();
    var year=date.getFullYear();
    var month=date.getMonth();
    var realMonth=month+1;
    var fillMonth = (realMonth<10) ? '0' + realMonth : realMonth;
    var date=date.getDate();
    var fillDate = (date<10) ? '0' + date : date;
    var sfx = ["th","st","nd","rd"];
    var val = date%100;
    var ordDate = date + (sfx[(val-20)%10] || sfx[val] || sfx[0]);
    
    
    //year
    string = string.replace(/%Y/g,year); // 2008
    string = string.replace(/%y/g,year.toString().slice(-2)); //08
    //month
    string = string.replace(/%M/g,months[month]); //January
    string = string.replace(/%m/g,months[month].slice(0,3)); //Jan
    string = string.replace(/%N/g,fillMonth); // 01
    string = string.replace(/%n/g,realMonth); // 1
    //day of week
    string = string.replace(/%W/g,days[day]); //Monday
    string = string.replace(/%w/g,days[day].slice(0,3)); //Mon
    //day of month
    string = string.replace(/%D/g,fillDate); //05
    string = string.replace(/%d/g,date); // 5
    //ordinal (1st) to day
    string = string.replace(/%O/ig,ordDate);
    return string;
  }
