
let root = document.getElementById("root");
let today = new Date();

let inputyear = document.getElementById("yearselect");
let inputmonth = document.getElementById("monthselect");
let li1 = document.getElementById("thisMonth");
let li2 = document.getElementById("thisYear");
let option1 = document.getElementById("startYear");
let option2 = document.getElementById("startMonth");

months = ["","Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "October", "November", "December"];
let calData = document.getElementById("calendar_data");

let inputbtn = document.createElement("button");
inputbtn.innerHTML = "Välj månad";
inputbtn.addEventListener("click", calender);

root.append(inputbtn);



createCalendar(calendar,new Date().getFullYear(), new Date().getMonth()+1);

async function API(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}


function calender() {
    createCalendar(calendar, inputyear.value, inputmonth.value);
};




async function createCalendar(elem, year, month) {

    calData.innerHTML="";
    li1.innerHTML = months[month];
    li2.innerHTML = year;
    option2.innerHTML = months[month];
    option2.value=month;
    option1.innerHTML = year;
    option1.value=year;

    let mon = month - 1; 
    let d = new Date(year, mon);

    let table = '<table cellspacing="0" cellpadding="0"><tr class="weekdays"><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';

    // spaces for the first row
    // from Monday till the first day of the month
    // * * * 1  2  3  4
    for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>';
    }

    // <td> with actual dates
    while (d.getMonth() == mon) {

        let day = d.getDate();

        let url = "https://sholiday.faboul.se/dagar/v2.1/" + year + "/" + month + "/" + day;
        let g = await API(url);

        if (g['dagar'][0]['arbetsfri dag'] == "Ja" && g.dagar[0].helgdag != null) {

            table += '<td class="active" onmouseover="holidayfuncin(this,'+ day +')" onmouseout="holidayfuncout(this,'+day+')">' + day + '</td>';

            let date = document.createElement("h3");
            date.innerHTML=g.dagar[0].datum;
            let week = document.createElement("p");
            week.innerHTML=g.dagar[0].veckodag + " vecka " + g.dagar[0].vecka;
            let holiday = document.createElement("h4");
            holiday.id=day;
            holiday.innerHTML=g.dagar[0].helgdag;
            calData.append(date,holiday,week);

        }
        else {
            if (day === today.getDate() && year === today.getFullYear() && month === today.getMonth()+1) {
                table += '<td class="today" onmouseover="todayin(this)" onmouseout="todayout(this,'+day+')">' + day + '</td>';
            }
            else{
            table += '<td>' + day + '</td>';
            }
        }


        if (getDay(d) % 7 == 6) { 
            table += '</tr><tr>';
        }

        d.setDate(day + 1);
    }

    // add spaces after last days of month for the last row
    // 29 30 31 * * * *
    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>';
        }
    }

    // close the table
    table += '</tr></table>';

    elem.innerHTML = table;
}

function getDay(date) { // get day number from 0 (monday) to 6 (sunday)
    let day = date.getDay();
    if (day == 0) day = 7; // make Sunday (0) the last day
    return day - 1;
}

function holidayfuncin(x,day){
    x.innerHTML=document.getElementById(day).textContent;
}
function holidayfuncout(x,day){
    x.innerHTML=day;
}
function todayin(x){
    x.innerHTML="Dagens datum";
}
function todayout(x,day){
    x.innerHTML=day;
}