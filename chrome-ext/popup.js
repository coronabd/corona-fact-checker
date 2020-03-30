document.addEventListener('DOMContentLoaded', onLoad);


function onLoad() {

  // Assign click events for pop up buttons
  document.querySelector('#myths').addEventListener('click', Myths);

  showURLLists();
}



url_list = ["www.msn.com", "www.yahoo.com", "www.bing.com"]; //add the urls here dyanmically
// create a list of blocked urls and display
function showURLLists() {
  var html = '';
  for (var index = 0; index < url_list.length; index++) {
    html = html + '<li>' + url_list[index] + '</li>';
  }

  document.getElementById('hosts').innerHTML = html;
}

function Myths() {
  alert("TODO Decide")
}
